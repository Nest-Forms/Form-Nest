SHELL := /bin/bash
.ONESHELL:
.SILENT:

include Makefile-frontend
#include Makefile-tests

RED = '\033[1;31m'
CYAN = '\033[0;36m'

export AWS_DEFAULT_REGION ?= us-east-2
CONFIG ?= dev

TF_PLAN            = config/$(CONFIG).plan
TF_PLAN_JSON       = $(TF_PLAN).json

TF_VARS := -var-file=config/$(CONFIG).tfvars

RUN_TF             = @docker-compose run --rm terraform
RUN_TF_BASH        = @docker-compose run --rm --entrypoint sh terraform
RUN_TF_LINT		   = @docker-compose run --rm --entrypoint=/bin/sh tflint -c "tflint --init && tflint --no-module" tflint 
RUN_TF_DOCS        = @docker-compose run --rm terraform_docs
RUN_AWS_CLI		   = @docker-compose run --rm --entrypoint sh aws
RUN_TRIVY	       = @docker-compose run --rm -w /app trivy

.PHONY: all
all: plan apply

.PHONY: tfbash
tfbash:
	echo -e --- $(CYAN)Running Terraform in a container...
	$(RUN_TF_BASH)

.PHONY: validate
validate:
	echo -e --- $(CYAN)Validating Terraform ...
	$(RUN_TF) init -input=false -backend=false
	$(RUN_TF) validate

.PHONY: init
init:
	echo -e --- $(CYAN)Initialising Terraform ...
	$(RUN_TF) init

.PHONY: plan
plan: init
	echo -e --- $(CYAN)Building Terraform ...
	$(RUN_TF) plan $(TF_VARS) -out $(TF_PLAN)

.PHONY: plan_json
plan_json: plan
	echo -e --- $(CYAN)Generating JSON Terraform deployment plan ...
	$(RUN_TF) show -json $(TF_PLAN) > terraform/$(TF_PLAN_JSON)

.PHONY: apply
apply: init
	echo -e --- $(CYAN)Deploying Terraform ...
	$(RUN_TF) apply $(TF_PLAN)

.PHONY: destroy
destroy: init
	echo -e --- $(CYAN)Running Destroy ...
	$(RUN_TF) destroy -auto-approve $(TF_VARS)

.PHONY: clean
clean:
	echo -e $(CYAN)Removing .terraform directory and purging orphaned Docker networks ...
	docker-compose run --rm --entrypoint="rm -rf .terraform" terraform
	docker-compose down --remove-orphans 2>/dev/null

.PHONY: trivy
trivy:
	@echo -e "$(GREEN)Running task: $@$(RESET)"
	$(RUN_TRIVY) fs --scanners vuln,secret,misconfig ./
	@echo "Done: $@"

.PHONY: fmt
fmt:
	echo -e --- $(CYAN)Formatting Terraform Files ...
	$(RUN_TF) fmt -recursive

.PHONY: fmt_check
fmt_check:
	echo -e --- $(CYAN)Format Checking Terraform Files ...
	$(RUN_TF) fmt -check -recursive

.PHONY: tflint
tflint:
	echo -e --- $(CYAN)Lint Checking Terraform Files ...
	$(RUN_TF_LINT)

.PHONY: terraform_docs
terraform_docs:
	echo -e --- $(CYAN)Creating Terraform Docs ...
	$(RUN_TF_DOCS) markdown /terraform_docs > README.md

.PHONY: aws_cli
aws_cli:
	echo -e --- $(CYAN)Launching AWS cli ...
	$(RUN_AWS_CLI)