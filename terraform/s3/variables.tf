variable "environment" {
  description = "environment being deployed to"
  type        = string
}

variable "enable_versioning" {
  description = "enable or disable versioninig"
  type        = bool
}

variable "cloudfront_s3_distribution" {
  type        = string
  description = "CloudFront Distribution to be used by the Web Application for accessing content from S3"
}
