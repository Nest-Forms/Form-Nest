terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4.9"
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.2"
    }
  }
}

# # Configure the AWS provider
provider "aws" {
  region = "eu-west-2"
}

# Terraform Backend Configuration for S3 with State Locking using DynamoDB
terraform {
  backend "s3" {
    bucket         = "nest-forms-dev-terraform-state"
    key            = "terraform/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "form-nest-terraform-state-lock"
    encrypt        = true
  }
}