terraform {
  required_providers {
    aws = {
      source                = "hashicorp/aws"
      version               = "~> 5.45.0"
      configuration_aliases = [aws.cloudfront]
    }
    archive = {
      source  = "hashicorp/archive"
      version = "~> 2.4.2"
    }
  }
}

provider "aws" {
  region = "eu-west-2"
}

# Used to create aws_acm_certificate for the cloudfront distribution
provider "aws" {
  alias  = "cloudfront"
  region = "us-east-1"
}