variable "region" {
  description = "AWS Region"
  type        = string
  default     = "eu-west-2"
}

variable "environment" {
  description = "environment being deployed to"
  type        = string
}

variable "enable_versionining" {
  description = "enable or disable versioninig"
  type        = string
}
