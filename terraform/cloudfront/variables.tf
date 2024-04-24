variable "bucket_name" {
  type        = string
  description = "Nest S3 bucketname"
}

variable "environment" {
  description = "environment being deployed to"
  type        = string
}

variable "cors_origins" {
  description = "List of allowed origins for the policy allowing CORS between the CF and Web Application."
  type        = list(any)
}
