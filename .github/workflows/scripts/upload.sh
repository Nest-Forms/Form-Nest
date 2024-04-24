#!/bin/bash
set -euo pipefail

aws s3 sync ./frontend/build s3://$CONFIG.forms-nest.co.uk --sse AES256
