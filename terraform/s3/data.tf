data "aws_iam_policy_document" "bucket_policy_document" {
  statement {
    sid = "ForceHTTPS"
    principals {
      type        = "AWS"
      identifiers = ["*"]
    }
    effect = "Deny"
    actions = [
      "s3:*"
    ]
    resources = [
      "arn:aws:s3:::${aws_s3_bucket.bucket.id}",
      "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*",
    ]

    condition {
      test     = "Bool"
      variable = "aws:SecureTransport"
      values   = ["false"]
    }
  }

  statement {
    sid = "DenyIncorrectEncryptionHeader"
    principals {
      type        = "*"
      identifiers = ["*"]
    }
    effect = "Deny"
    actions = [
      "s3:PutObject"
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
    ]

    condition {
      test     = "StringNotEquals"
      variable = "s3:x-amz-server-side-encryption"
      values   = ["AES256"]
    }
  }

  statement {
    sid = "DenyUnencryptedObjectUploads"

    principals {
      type        = "*"
      identifiers = ["*"]
    }

    effect = "Deny"
    actions = [
      "s3:PutObject"
    ]

    resources = [
      "arn:aws:s3:::${aws_s3_bucket.bucket.id}/*"
    ]

    condition {
      test     = "Null"
      variable = "s3:x-amz-server-side-encryption"
      values   = ["true"]
    }
  }

  # Cloudfront config; need a cloudfront distro first
  #   statement {
  #     sid       = "AllowCloudFrontServicePrincipalReadOnly"
  #     effect    = "Allow"
  #     actions   = ["s3:GetObject"]
  #     resources = ["${aws_s3_bucket.bucket.arn}/*"]

  #     principals {
  #       type        = "Service"
  #       identifiers = ["cloudfront.amazonaws.com"]
  #     }

  #     condition {
  #       test     = "StringEquals"
  #       variable = "AWS:SourceArn"
  #       values   = [var.cloudfront_s3_distribution]
  #     }
}