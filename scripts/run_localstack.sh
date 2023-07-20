#!/bin/bash

# Script to initialize AWS services on local environment running localstack
#
# Usage: bash ./script/start_localstack.sh
#

##########################################################
# 
# Common functions
#

echo_step() {
  echo -e "\\e[48;5;154m\\e[38;5;0m   ${STEP}   \\e[0m ${1}"
  (( STEP=STEP+1 ))
}

echo_err() {
  echo -e "\\e[48;5;201m\\e[38;5;0m  error  \\e[0m ${1}"
}


##########################################################
# 
# Initialize environment variables and check for prerequisites
#

CUR_DIR=$(pwd)
STEP=1
START=$(date +%s)

export TMPDIR=/private$TMPDIR
export SERVICES="lambda,sqs,dynamodb"
export LAMBDA_EXECUTOR=docker-reuse
export DEBUG=1

LAMBDA_FUNCTION_NAME=my_lambda

##########################################################
# 
# Actual script starts here
#

echo_step "Start Localstack with Docker Compose"
cd submodules/localstack
docker-compose up -d
sleep 10
cd ${CUR_DIR}

echo_step "Initialize Localstack components"
bash ./scripts/init_localstack.sh

# echo_step "Run Lambda function for the first time and connect the container to localstack network"
# aws --endpoint-url http://localhost:4574 lambda invoke --function-name "${LAMBDA_FUNCTION_NAME}" outfile.txt
# docker network connect localstack_default "localstack_lambda_arn_aws_lambda_us-east-1_000000000000_function_${LAMBDA_FUNCTION_NAME}" --link localstack
