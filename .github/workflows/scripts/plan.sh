#!/bin/bash
set -euox pipefail

# Assume the deployment role
ROLE_ARN="arn:aws:iam::767397886223:role/DeploymentRole"
aws sts assume-role --role-arn $ROLE_ARN --role-session-name GitHubActionsSession > assumed-role.json
export AWS_ACCESS_KEY_ID=$(jq -r .Credentials.AccessKeyId assumed-role.json)
export AWS_SECRET_ACCESS_KEY=$(jq -r .Credentials.SecretAccessKey assumed-role.json)
export AWS_SESSION_TOKEN=$(jq -r .Credentials.SessionToken assumed-role.json)

# Run plan
make plan_json
