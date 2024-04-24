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
