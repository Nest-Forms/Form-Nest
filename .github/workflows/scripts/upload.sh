#!/bin/bash
set -euo pipefail

echo "syncing from ./frontend/build to s3://$CONFIG.nest-forms.co.uk"
aws s3 sync ./frontend/build s3://$CONFIG.nest-forms.co.uk --sse AES256
