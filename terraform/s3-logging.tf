data "aws_caller_identity" "current" {}

resource "aws_s3_bucket" "logging" {
  bucket = var.logging_bucket_name

  tags = {
    Name = var.logging_bucket_name
  }
}

resource "aws_s3_bucket_ownership_controls" "logging_bucket_ownership" {
  bucket = aws_s3_bucket.logging.id

  rule {
    object_ownership = "BucketOwnerEnforced"
  }
}

resource "aws_s3_bucket_policy" "logging_bucket_policy" {
  bucket = aws_s3_bucket.logging.id
  policy = data.aws_iam_policy_document.logging_bucket_policy_document.json
}

data "aws_iam_policy_document" "logging_bucket_policy_document" {
  statement {
    sid = "S3ServerAccessLogsPolicy"
    principals {
      type        = "Service"
      identifiers = ["logging.s3.amazonaws.com"]
    }
    effect = "Allow"
    actions = [
      "s3:PutObject"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.logging.id}/${var.bucket_name}*",
    ]

    condition {
      test     = "StringEquals"
      variable = "aws:SourceAccount"
      values = [
        data.aws_caller_identity.current.account_id
      ]
    }
  }
}

resource "aws_s3_bucket_versioning" "logging_bucket_versioning" {
  bucket = aws_s3_bucket.logging.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_public_access_block" "logging_block_public_access" {
  bucket                  = aws_s3_bucket.logging.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "logging_server_side_encryption" {
  bucket = aws_s3_bucket.logging.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_lifecycle_configuration" "logging_lifecycle_configuration" {
  bucket = aws_s3_bucket.logging.id

  rule {
    id     = "all"
    status = "Enabled"


    # expire and permanently delete objects after 15 days
    expiration {
      days = 15
    }
    noncurrent_version_expiration {
      noncurrent_days = 1
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}
