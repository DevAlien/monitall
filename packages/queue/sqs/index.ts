import AWS from "aws-sdk";

import { MonitorStatusEventMessage } from "../types";

// const env = {
//   REGION: "us-east-1", // should match the one given in the docker-compose.yml file
//   ACCOUNT_ID: "000000000000", // represents the dummy aws account id for localstack
//   IAM: {
//     ACCESS_KEY_ID: "na",
//     SECRET_ACCESS_KEY: "na",
//   },
//   SERVICE_ENDPOINT: "http://localhost:4566", // represents the service point for localstack
//   QUEUE_NAME: "my_sqs", // queue name used in this tutorial for implementation
// };

// AWS.config.update({
//   region: env.REGION,
// });

// // create an sqs service object
// const SQS = new AWS.SQS({
//   endpoint: env.SERVICE_ENDPOINT,
//   accessKeyId: env.IAM.ACCESS_KEY_ID,
//   secretAccessKey: env.IAM.SECRET_ACCESS_KEY,
//   // region: env.REGION,
//   apiVersion: "2012-11-05",
// });

AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
const SQS = new AWS.SQS({ apiVersion: "2012-11-05" });

function sendMessage(body: MonitorStatusEventMessage, scheduledAt: Date) {
  const now = new Date();
  let seconds = Math.abs(scheduledAt.getTime() - now.getTime()) / 1000;
  const params = {
    QueueUrl: process.env.SQS_QUEUE!,
    DelaySeconds: seconds,
    MessageBody: JSON.stringify(body),
    // QueueUrl: process.env.QUEUE_AWS_REGION,
  };

  SQS.sendMessage(params, (err, result) => {
    if (err) {
      console.log(err);
      return;
    }
  });
}

export default sendMessage;
