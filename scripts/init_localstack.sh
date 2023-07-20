#!/bin/bash

# Script to initialize AWS services on local environment running localstack
#
# Usage: bash ./script/init_localstack.sh
#
# References:
# https://dev.classmethod.jp/cloud/aws/localstack-lambda/
# https://docs.aws.amazon.com/cli/latest/reference/lambda/index.html#cli-aws-lambda
# https://docs.aws.amazon.com/cli/latest/reference/dynamodb/index.html#cli-aws-dynamodb
# https://docs.aws.amazon.com/cli/latest/reference/sqs/index.html#cli-aws-sqs
#

##########################################################
# 
# Common functions
#

echo_step() {
  echo -e "\\e[48;5;111m\\e[38;5;0m   ${STEP}   \\e[0m ${1}"
  (( STEP=STEP+1 ))
}

echo_err() {
  echo -e "\\e[48;5;201m\\e[38;5;0m  error  \\e[0m ${1}"
}

command_exists() {
  if hash "${1}" 2>/dev/null; then
    return 0
  else
    return 1
  fi
}

env_var_exists() {
 eval ENV_VAR=\$$1
  if [ -z "${ENV_VAR}" ]; then
    echo_err "$1 was not provided in '.env', aborting deploy!"
    exit 1
  fi
}

create_or_replace_lambda() {
  FUNCTION_NAME=$1
  SOURCE_DIR="./serverless/lambda/${FUNCTION_NAME}"

  aws --endpoint-url=http://localhost:4574 lambda get-function --function-name="${FUNCTION_NAME}" > /dev/null 2>&1
  RES=$?
  if [ "${RES}" -eq "0" ]; then
    echo "Function ${FUNCTION_NAME} already exists, re-creating..."
    aws --endpoint-url=http://localhost:4574 lambda delete-function --function-name="${FUNCTION_NAME}"
  fi

  cd "${SOURCE_DIR}" || exit 1
  zip -q -r "../../../tmp/lambda_function.${FUNCTION_NAME}.zip" .
  cd "${CUR_DIR}" || exit 1
  aws --endpoint-url=http://localhost:4574 lambda create-function \
    --cli-input-json "file://serverless/lambda/${FUNCTION_NAME}.json" \
    --zip-file "fileb://tmp/lambda_function.${FUNCTION_NAME}.zip"
  rm "./tmp/lambda_function.${FUNCTION_NAME}.zip"
}

create_or_replace_dynamodb_table() {
  TABLE_NAME=$1
  JSON_PATH="serverless/dynamodb/${TABLE_NAME}.json"
  aws --endpoint-url=http://localhost:4569 dynamodb describe-table --table-name="${TABLE_NAME}" > /dev/null 2>&1
  RES=$?
  if [ "${RES}" -eq "0" ]; then
    echo "Table ${TABLE_NAME} already exists, re-creating..."
    aws --endpoint-url=http://localhost:4569 dynamodb delete-table --table-name="${TABLE_NAME}"
  fi
  aws --endpoint-url=http://localhost:4569 dynamodb create-table \
    --cli-input-json "file://${JSON_PATH}"
}

create_or_replace_sqs() {
  QUEUE_NAME=$1
  aws --endpoint-url=http://localhost:4576 sqs get-queue-url --queue-name "${QUEUE_NAME}" > /dev/null 2>&1
  RES=$?
  if [ "${RES}" -eq "0" ]; then
    echo "Queue ${QUEUE_NAME} already exists."
  else
    aws --endpoint-url=http://localhost:4576 sqs create-queue \
      --queue-name "${QUEUE_NAME}"
  fi
}

create_sqs_trigger_to_lambda() {
  SQS_ARN=$1
  LAMBDA_NAME=$2
  aws --endpoint-url=http://localhost:4574 lambda create-event-source-mapping \
    --event-source-arn ${SQS_ARN} \
    --function-name ${LAMBDA_NAME}
}

##########################################################
# 
# Initialize environment variables and check for prerequisites
#

CUR_DIR=$(pwd)
STEP=1
START=$(date +%s)

echo_step "Check for tools pre-requisites"
if command_exists aws; then
  echo "AWS CLI already installed :)"
else
  echo_err "AWS CLI not installed, please go to https://docs.aws.amazon.com/ja_jp/cli/latest/userguide/installing.html and install it."
  exit 1
fi
if command_exists zip; then
  echo "ZIP already installed :)"
else
  echo_err "ZIP not installed, please install it."
  exit 1
fi

if [ ! -d "./tmp" ]; then
  mkdir ./tmp
fi

echo_step "Load '.env' environment variables"
if [ -e .env ]; then
  while read -r line; do
    export "${line?}"
  done < .env
fi

env_var_exists AWS_ACCESS_KEY_ID
env_var_exists AWS_DEFAULT_REGION
env_var_exists AWS_SECRET_ACCESS_KEY
env_var_exists AWS_DEFAULT_OUTPUT
echo "AWS variables exported :)"

##########################################################
# 
# Actual script starts here
#

# echo_step "Create Lambda function [my_lambda]"
# create_or_replace_lambda "my_lambda"

echo_step "Create SQS Queue [my_sqs]"
create_or_replace_sqs "my_sqs"

# echo_step "Create Trigger from SQS Queue [my_sqs] to call Lambda [my_lambda]"
# create_sqs_trigger_to_lambda "arn:aws:sqs:us-east-1:queue:my_sqs" "my_lambda"

FINISH=$(date +%s)
TIME=$((FINISH-START))
echo "Completed in ${TIME} seconds."
