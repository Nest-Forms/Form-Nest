# Configure the AWS provider
provider "aws" {
  region = "eu-west-2"
}

# Terraform Backend Configuration for S3 with State Locking using DynamoDB
terraform {
  backend "s3" {
    bucket         = "form-nest-terraform-state"
    key            = "terraform/terraform.tfstate"
    region         = "eu-west-2"
    dynamodb_table = "form-nest-terraform-state-lock" 
    encrypt        = true
  }
}
