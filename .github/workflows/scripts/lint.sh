#!/bin/bash
set -euo pipefail

# Run tflint
make tflint

# Run fmt check 
make fmt_check