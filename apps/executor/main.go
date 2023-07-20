package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/digitaljanitors/go-httpstat"
	"github.com/go-pg/pg/v10"
)

var SetupError error

type MonitorEventStatus string

const (
	Pending  MonitorEventStatus = "PENDING"
	Running  MonitorEventStatus = "RUNNING"
	Finished MonitorEventStatus = "FINISHED"
)

type MonitorEventResult string

const (
	Success MonitorEventResult = "SUCCESS"
	Failure MonitorEventResult = "FAILURE"
)

type MonitorEvent struct {
	ID          int
	ScheduledAt *time.Time
	StartTime   *time.Time
	EndTime     *time.Time
	Duration    *int
	Status      MonitorEventStatus
	Result      *MonitorEventResult
	Average     *int
	Min         *int
	Max         *int
	CreatedAt   time.Time
	UpdatedAt   time.Time
	MonitorID   int
	Address     string
}

type TinyMonitorEvent struct {
	Timestamp      *time.Time `json:"timestamp"`
	DNS            int        `json:"dns"`
	TCP            int        `json:"tcp"`
	TLS            int        `json:"tls"`
	Processing     int        `json:"processing"`
	Region         string     `json:"region"`
	StatusCode     int        `json:"status_code"`
	MonitorID      int        `json:"monitor_id"`
	MonitorEventID int        `json:"monitor_event_id"`
}

var db *pg.DB

func init() {
	fmt.Println("init")
	fmt.Println(os.Getenv("DATABASE_URL"))
	opt, err := pg.ParseURL(os.Getenv("DATABASE_URL"))
	if err != nil {
		panic(err)
	}

	db = pg.Connect(opt)
}

// func GenerateResponse(Body string, Code int) events.APIGatewayProxyResponse {
// 	return events.APIGatewayProxyResponse{Body: Body, StatusCode: Code, Headers: map[string]string{
// 		"Access-Control-Allow-Origin":  "*",
// 		"Access-Control-Allow-Methods": "POST,OPTIONS",
// 		"Access-Control-Allow-Headers": "X-Amz-Date,X-Api-Key,X-Amz-Security-Token,X-Requested-With,X-Auth-Token,Referer,User-Agent,Origin,Content-Type,Authorization,Accept,Access-Control-Allow-Methods,Access-Control-Allow-Origin,Access-Control-Allow-Headers",
// 	}}
// }

func HandleRequest(req events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	// Get the `isbn` query string parameter from the request and
	// validate it.request.QueryStringParameters["id"]
	monitorEventID := req.QueryStringParameters["monitor_event_id"]

	var monitorEvent MonitorEvent
	_, err := db.QueryOne(&monitorEvent, "SELECT * from monitor_events where id = ?", monitorEventID)
	if err != nil {
		fmt.Println("asd2")
		return serverError(err)
	}
	fmt.Println("before")
	fmt.Println(monitorEvent.Address)
	out, err := traceHttp(monitorEvent.Address, monitorEvent.MonitorID, monitorEvent.ID, *monitorEvent.ScheduledAt)
	fmt.Println("after")
	if err != nil {
		fmt.Println("asd2")
		return serverError(err)
	}

	js, err := json.Marshal(out)
	if err != nil {
		return serverError(err)
	}

	// Return a response with a 200 OK status and the JSON book record
	// as the body.
	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusOK,
		Body:       string(js),
	}, nil
}

func traceHttp(url string, monitorID int, monitorEventID int, timestamp time.Time) (TinyMonitorEvent, error) {
	// Create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		log.Fatal(err)
	}
	// Create a httpstat powered context
	var result httpstat.Result
	ctx := httpstat.WithHTTPStat(req.Context(), &result)
	req = req.WithContext(ctx)
	// Send request by default HTTP client
	client := http.DefaultClient
	res, err := client.Do(req)
	if err != nil {
		log.Fatal(err)
	}
	if _, err := io.Copy(ioutil.Discard, res.Body); err != nil {
		log.Fatal(err)
	}
	res.Body.Close()
	timest := time.Now()
	tinyMonitorEvent := &TinyMonitorEvent{
		Timestamp:      &timest,
		Region:         os.Getenv("AWS_REGION"),
		MonitorID:      monitorID,
		MonitorEventID: monitorEventID,
		DNS:            int(result.DNSLookup / time.Millisecond),
		TCP:            int(result.TCPConnection / time.Millisecond),
		TLS:            int(result.TLSHandshake / time.Millisecond),
		Processing:     int(result.ServerProcessing / time.Millisecond),
		StatusCode:     res.StatusCode,
	}
	// var jsonStr = []byte(`{"timestamp":"2022-10-27T11:43:02.099Z","transaction_id":"8d1e1533-6071-4b10-9cda-b8429c1c7a67","name":"Bobby Drake","email":"bobby.drake@pressure.io","age":42,"passport_number":3847665,"flight_from":"Barcelona","flight_to":"London","extra_bags":1,"flight_class":"economy","priority_boarding":false,"meal_choice":"vegetarian","seat_number":"15D","airline":"Red Balloon"}`)
	jso, err := json.Marshal(&tinyMonitorEvent)
	if err != nil {
		fmt.Println(err)
	}

	req2, err := http.NewRequest("POST", "https://api.tinybird.co/v0/events?name=monitor_events", bytes.NewBuffer(jso))
	req2.Header.Set("Authorization", fmt.Sprintf("Bearer %s", os.Getenv("TINYBIRD_TOKEN")))
	req2.Header.Set("Content-Type", "application/json")

	client1 := &http.Client{Timeout: time.Second * 10}

	resp, err := client1.Do(req2)
	if err != nil {
		fmt.Println("error")
		fmt.Println(err)
		return *tinyMonitorEvent, err
	}
	defer resp.Body.Close()
	fmt.Println("response Status:", resp.Status)
	return *tinyMonitorEvent, nil

}

func serverError(err error) (events.APIGatewayProxyResponse, error) {
	fmt.Println(err.Error())

	return events.APIGatewayProxyResponse{
		StatusCode: http.StatusInternalServerError,
		Body:       http.StatusText(http.StatusInternalServerError),
	}, nil
}

func main() {

	lambda.Start(HandleRequest)
}
