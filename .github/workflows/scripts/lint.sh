#!/bin/bash
set -euox pipefail

# Run tflint
make tflint

# Run fmt check 
make fmt_check