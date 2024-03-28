output "http_api_url" {
  value = "${aws_apigatewayv2_api.my_http_api.api_endpoint}"
}
output "cognito_app_client_id" {
  value = aws_cognito_user_pool_client.my_user_pool_client.id
}

output "company_db_table_name" {
  value = aws_dynamodb_table.company_table.name
}