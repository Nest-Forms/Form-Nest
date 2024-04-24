output "http_api_url" {
  value = aws_apigatewayv2_api.my_http_api.api_endpoint
}

output "cognito_app_client_id" {
  value = aws_cognito_user_pool_client.my_user_pool_client.id
}

output "company_db_table_name" {
  value = aws_dynamodb_table.company_table.name
}

output "distribution" {
  value = aws_cloudfront_distribution.cf_s3_distribution.arn
}

output "bucket" {
  value = aws_s3_bucket.bucket.id
}