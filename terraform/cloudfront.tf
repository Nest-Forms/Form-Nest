locals {
  s3_origin_id = "${aws_s3_bucket.bucket.id}."
}

resource "aws_cloudfront_origin_access_control" "origin_access_control" {
  name                              = "origin_access_control_${aws_s3_bucket.bucket.id}"
  origin_access_control_origin_type = "s3"
  signing_behavior                  = "always"
  signing_protocol                  = "sigv4"
}

resource "aws_cloudfront_distribution" "cf_s3_distribution" {
  origin {
    domain_name              = "${var.environment}.nest-forms.co.uk.s3.eu-west-2.amazonaws.com"
    origin_id                = local.s3_origin_id
    origin_access_control_id = aws_cloudfront_origin_access_control.origin_access_control.id
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  aliases = ["${var.environment}.nest-forms.co.uk"]

  default_cache_behavior {
    allowed_methods            = ["GET", "HEAD", "OPTIONS"]
    cached_methods             = ["GET", "HEAD"]
    target_origin_id           = local.s3_origin_id
    cache_policy_id            = data.aws_cloudfront_cache_policy.caching_optimised.id
    compress                   = true
    viewer_protocol_policy     = "redirect-to-https"
    response_headers_policy_id = aws_cloudfront_response_headers_policy.cors_response_headers_policy.id
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 404
    response_code         = 200
    response_page_path    = "/index.html"
  }

  custom_error_response {
    error_caching_min_ttl = 0
    error_code            = 403
    response_code         = 200
    response_page_path    = "/index.html"
  }

  # restrict to GB for now
  restrictions {
    geo_restriction {
      restriction_type = "whitelist"
      locations        = ["GB"]
    }
  }

  viewer_certificate {
    acm_certificate_arn            = aws_acm_certificate.cert.arn
    cloudfront_default_certificate = false
    ssl_support_method             = "sni-only"
    minimum_protocol_version       = "TLSv1.2_2021"
  }
}

data "aws_cloudfront_cache_policy" "caching_optimised" {
  name = "Managed-CachingOptimized"
}

resource "aws_cloudfront_response_headers_policy" "cors_response_headers_policy" {
  name    = "cors_response_headers_policy"
  comment = "Allows CORS between CF and Nest site and adds custom response header for browser caching"

  custom_headers_config {
    items {
      header   = "cache-control"
      override = true
      value    = "public, max-age=86400"
    }
  }
  cors_config {
    access_control_max_age_sec       = 600
    access_control_allow_credentials = false

    access_control_allow_headers {
      items = ["*"]
    }

    access_control_allow_methods {
      items = ["HEAD", "GET", "OPTIONS"]
    }

    access_control_allow_origins {
      items = var.cors_origins ## What should this be?!
    }
    origin_override = true
  }
}

resource "aws_acm_certificate" "cert" {
  domain_name       = "${var.environment}.nest-forms.co.uk"
  validation_method = "DNS"
  provider          = aws.cloudfront
}

data "aws_vpc" "default" {
  default = true
}

data "aws_route53_zone" "zone" {
  name         = "nest-forms.co.uk" # This will need to be parameterised when we create new accounts
  private_zone = false
}

resource "aws_route53_record" "record" {
  for_each = {
    for dvo in aws_acm_certificate.cert.domain_validation_options : dvo.domain_name => {
      name   = dvo.resource_record_name
      record = dvo.resource_record_value
      type   = dvo.resource_record_type
    }
  }

  allow_overwrite = true
  name            = each.value.name
  records         = [each.value.record]
  ttl             = 60
  type            = each.value.type
  zone_id         = data.aws_route53_zone.zone.zone_id
}

resource "aws_route53_record" "cdn-name" {
  zone_id = data.aws_route53_zone.zone.zone_id
  name    = aws_acm_certificate.cert.domain_name
  type    = "CNAME"
  ttl     = "300"
  records = [aws_cloudfront_distribution.cf_s3_distribution.domain_name]
}

resource "aws_acm_certificate_validation" "validation" {
  certificate_arn         = aws_acm_certificate.cert.arn
  validation_record_fqdns = [for record in aws_route53_record.record : record.fqdn]
  provider                = aws.cloudfront
}
