variable "region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "environment being deployed to"
  type        = string
}

variable "enable_versioning" {
  description = "enable or disable versioninig"
  type        = string
}

variable "cors_origins" {
  description = "List of allowed origins for the policy allowing CORS between the CF and Web Application."
  type        = list(any)
}

variable "bucket_name" {
  description = "Name of the bucket that hosts the nest website"
  type        = string
}

variable "logging_bucket_name" {
  description = "Name of the logging bucket"
  type        = string
}
