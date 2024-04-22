#!/bin/bash
set -euo pipefail

ROLE_ARN=$1

echo "Assuming role: $ROLE_ARN"

aws sts assume-role --role-arn $ROLE_ARN --role-session-name GitHubActionsSession > assumed-role.json
export AWS_ACCESS_KEY_ID=$(jq -r .Credentials.AccessKeyId assumed-role.json)
export AWS_SECRET_ACCESS_KEY=$(jq -r .Credentials.SecretAccessKey assumed-role.json)
export AWS_SESSION_TOKEN=$(jq -r .Credentials.SessionToken assumed-role.json)

aws sts get-caller-identity