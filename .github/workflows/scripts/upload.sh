#!/bin/bash
set -euo pipefail

aws s3 sync ./build s3://$CONFIG.forms-nest.co.uk --sse AES256
