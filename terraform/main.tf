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

module "s3" {
  source                     = "./s3"
  environment                = var.environment
  enable_versioning          = var.enable_versioning
  cloudfront_s3_distribution = module.cloudfront.distribution
}

module "cloudfront" {
  source       = "./cloudfront"
  bucket_name  = module.s3.bucket.id
  environment  = var.environment
  cors_origins = var.cors_origins
  providers = {
    aws.cloudfront = aws.cloudfront
  }
}