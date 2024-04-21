#!/bin/bash
set -euox pipefail

aws s3 sync ./build s3://forms-nest-dev
