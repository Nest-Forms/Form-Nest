resource "aws_s3_bucket" "bucket" {
  bucket        = var.bucket_name
  force_destroy = true
  tags = {
    Name = var.bucket_name
  }
}

resource "aws_s3_bucket_policy" "bucket_policy" {
  bucket = aws_s3_bucket.bucket.id
  policy = data.aws_iam_policy_document.bucket_policy_document.json
}

resource "aws_s3_bucket_versioning" "bucket_versioning" {
  bucket = aws_s3_bucket.bucket.id

  versioning_configuration {
    status = var.enable_versioning ? "Enabled" : "Suspended"
  }
}

resource "aws_s3_bucket_public_access_block" "block_public_access" {
  bucket                  = aws_s3_bucket.bucket.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

resource "aws_s3_bucket_server_side_encryption_configuration" "server_side_encryption" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_website_configuration" "forms_nest" {
  bucket = aws_s3_bucket.bucket.id
  index_document {
    suffix = "index.html"
  }
}

# Keep 1 non current version
resource "aws_s3_bucket_lifecycle_configuration" "lifecycle_configuration" {
  bucket = aws_s3_bucket.bucket.id

  rule {
    id     = "ExpireNonCurrentVersions"
    status = "Enabled"
    noncurrent_version_expiration {
      noncurrent_days           = 1
      newer_noncurrent_versions = 1
    }
  }

  rule {
    id     = "ExpireDeleteMarkers"
    status = "Enabled"

    expiration {
      expired_object_delete_marker = true
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 7
    }
  }
}

resource "aws_s3_bucket_logging" "bucket_logging" {
  bucket = aws_s3_bucket.bucket.id

  # Ideally this would be a centralised bucket created by an infra repo
  # and then pulled in via data.ssm_parameter.logging_bucket_name.value
  target_bucket = aws_s3_bucket.logging.id
  target_prefix = "${var.bucket_name}/"
}
