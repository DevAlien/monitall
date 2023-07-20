package main

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"math"
	"net/http"
	"os"
	"sync"
	"time"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sqs"
	"github.com/go-pg/pg/v10"
)

type Region struct {
	ID          int
	Name        string
	Description string
	Key         string
	Address     string
	CreatedAt   time.Time
	UpdatedAt   time.Time
}

type MonitorType string

const (
	Ping MonitorType = "PING"
	HTTP MonitorType = "HTTP"
	// Add more check types as needed
)

type MonitorStatus string

const (
	Active   MonitorStatus = "ACTIVE"
	Inactive MonitorStatus = "INAVCTIVE"
	// Add more check statuses as needed
)

type Monitor struct {
	ID             int
	Name           string
	Type           MonitorType
	Address        string
	Interval       int
	Region         string
	Status         MonitorStatus
	LastExecutedAt *time.Time
	CreatedBy      string
	OrganizationID string
	CreatedAt      time.Time
	UpdatedAt      time.Time
}

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

type BodyMessage struct {
	ID        int `json:"id"`
	MonitorID int `json:"monitorId"`
}

func handler(ctx context.Context, sqsEvent events.SQSEvent) error {
	var wg sync.WaitGroup
	wg.Add(len(sqsEvent.Records))
	for _, message := range sqsEvent.Records {
		fmt.Printf("The message %s for event source %s = %s \n", message.MessageId, message.EventSource, message.Body)
		go handleMessage(&message)
	}
	wg.Wait()

	return nil
}

func handleMessage(message *events.SQSMessage) {
	var body BodyMessage
	err := json.Unmarshal([]byte(message.Body), &body)
	if err != nil {
		fmt.Println("failed to unmarshal message %v", err)
	}
	ses, err := session.NewSession(&aws.Config{
		Region: aws.String("eu-central-1"),
	})

	if err != nil {
		log.Fatal("Error loading .env file")
	}
	sqsSvc := sqs.New(ses)
	fmt.Println("body", body)
	fmt.Println("body", body.ID)
	var monitorEvent MonitorEvent
	_, err = db.QueryOne(&monitorEvent, "SELECT * from monitor_events where id = ?", body.ID)
	if err != nil {

		fmt.Printf("Model1a: %v\n", err)
	}
	if monitorEvent.ID == 0 {
		_, err = sqsSvc.DeleteMessage(&sqs.DeleteMessageInput{
			QueueUrl:      aws.String(os.Getenv("SQS_QUEUE")),
			ReceiptHandle: &message.ReceiptHandle,
		})
		return
	}

	monitorEvent.Status = Running
	startTime := time.Now()
	monitorEvent.StartTime = &startTime
	_, err = db.Model(&monitorEvent).
		Set("status = ?", monitorEvent.Status).
		Set("start_time = ?", monitorEvent.StartTime).
		Where("id = ?", monitorEvent.ID).
		Returning("*").
		Update()
	if err != nil {
		fmt.Printf("Updating err: %v\n", err)
	}

	var model1 Monitor
	_, err = db.QueryOne(&model1, "SELECT * from monitors where id = ?", body.MonitorID)
	if err != nil {

		fmt.Printf("Model1b: %v\n", err)
	}
	if model1.ID == 0 || model1.Status != "ACTIVE" {
		_, err = sqsSvc.DeleteMessage(&sqs.DeleteMessageInput{
			QueueUrl:      aws.String(os.Getenv("SQS_QUEUE")),
			ReceiptHandle: &message.ReceiptHandle,
		})
		return
	}

	fmt.Printf("Model1c: %v\n", model1)
	var wg sync.WaitGroup
	regions := []string{"eu-central-1", "us-east-1", "us-west-2"} //, "us-west-1", "us-west-2"}

	var dbRegions []Region
	_, err = db.Query(&dbRegions, "SELECT * from regions where key in (?)", pg.In(regions))
	if err != nil {

		fmt.Printf("dbRegions: %v\n", err)
	}
	fmt.Println("dbRegions", dbRegions)
	fmt.Println("dbRegions", len(dbRegions))
	wg.Add(len(dbRegions))
	for _, region := range dbRegions {
		go callTracer(&wg, region, monitorEvent.ID) //traceHttp(&wg, region, model1.Address, model1.ID, monitorEvent.ID, startTime)
	}

	fmt.Println("Waiting for goroutines to finish...")
	wg.Wait()
	fmt.Println("FINISHED")
	fmt.Println(body)

	endTime := time.Now()
	monitorEvent.EndTime = &endTime
	monitorEvent.Status = Finished
	result := Success
	monitorEvent.Result = &result
	average := 120
	min := 100
	max := 150
	monitorEvent.Average = &average
	monitorEvent.Min = &min
	monitorEvent.Max = &max
	_, err = db.Model(&monitorEvent).
		Set("status = ?", monitorEvent.Status).
		Set("end_time = ?", monitorEvent.EndTime).
		Set("average = ?", monitorEvent.Average).
		Set("min = ?", monitorEvent.Min).
		Set("max = ?", monitorEvent.Max).
		Where("id = ?", monitorEvent.ID).
		Returning("*").
		Update()
	if err != nil {
		fmt.Printf("Updating err: %v\n", err)
	}
	_, err = sqsSvc.DeleteMessage(&sqs.DeleteMessageInput{
		QueueUrl:      aws.String(os.Getenv("SQS_QUEUE")),
		ReceiptHandle: &message.ReceiptHandle,
	})

	fmt.Println("FINISHED REAL")
	fmt.Println(monitorEvent.ScheduledAt)
	fmt.Println(model1.Interval)
	scheduledAt := monitorEvent.ScheduledAt.Add(time.Duration(model1.Interval) * time.Second)
	fmt.Println(scheduledAt)
	newMonitorEvent := &MonitorEvent{
		ScheduledAt: &scheduledAt,
		MonitorID:   monitorEvent.MonitorID,
		Address:     monitorEvent.Address,
	}

	_, err = db.Model(newMonitorEvent).Insert()
	if err != nil {
		fmt.Println(err)
	}
	diff := time.Now().Sub(scheduledAt)

	fmt.Println(time.Now())
	//In seconds

	fmt.Printf("Seconds: %f\n", math.Abs(diff.Seconds()))
	fmt.Println(int64(diff.Seconds()))
	seconds := int64(math.Abs(diff.Seconds()))
	if seconds > 58 {
		seconds = 58
	}
	_, err = sqsSvc.SendMessage(&sqs.SendMessageInput{
		DelaySeconds: aws.Int64(seconds),

		MessageBody: aws.String(fmt.Sprintf(`{"id": %d, "monitorId": %d}`, newMonitorEvent.ID, newMonitorEvent.MonitorID)),
		QueueUrl:    aws.String(os.Getenv("SQS_QUEUE")),
	})
	if err != nil {
		fmt.Println(err)
	}
}

func callTracer(wg *sync.WaitGroup, region Region, monitorEventID int) {
	defer wg.Done()

	res, err := http.Get(fmt.Sprintf("%s?monitor_event_id=%d", region.Address, monitorEventID))
	if err != nil {
		fmt.Printf("error making http request: %s\n", err)
		return
	}

	defer res.Body.Close()
	body, err := ioutil.ReadAll(res.Body)
	fmt.Println(string(body))
}

func main() {
	lambda.Start(handler)
}
