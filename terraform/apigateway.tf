resource "aws_apigatewayv2_api" "my_http_api" {
  name          = "nest-forms-http-api"
  protocol_type = "HTTP"
  description   = "HTTP API for user management"

  cors_configuration {
    allow_headers = ["Content-Type", "X-Amz-Date", "Authorization", "X-Api-Key", "X-Amz-Security-Token"]
    allow_methods = ["OPTIONS", "GET", "POST", "PUT", "DELETE"]
    allow_origins = ["*"]
    expose_headers = ["Content-Length"]
    max_age = 300
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id           = aws_apigatewayv2_api.my_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.user_management_lambda.invoke_arn
}

resource "aws_apigatewayv2_route" "lambda_route" {
  api_id    = aws_apigatewayv2_api.my_http_api.id
  route_key = "POST /user"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

# New integration for the login function
resource "aws_apigatewayv2_integration" "login_lambda_integration" {
  api_id           = aws_apigatewayv2_api.my_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.user_login_lambda.invoke_arn
}

# New route for the login function
resource "aws_apigatewayv2_route" "login_route" {
  api_id    = aws_apigatewayv2_api.my_http_api.id
  route_key = "POST /login"
  target    = "integrations/${aws_apigatewayv2_integration.login_lambda_integration.id}"
}

resource "aws_apigatewayv2_integration" "get_user_lambda" {
  api_id           = aws_apigatewayv2_api.my_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.get_user_lambda.invoke_arn
}

# New route for the login function
resource "aws_apigatewayv2_route" "get_user_route" {
  api_id    = aws_apigatewayv2_api.my_http_api.id
  route_key = "POST /getuser"
  target    = "integrations/${aws_apigatewayv2_integration.get_user_lambda.id}"
}

resource "aws_apigatewayv2_integration" "admin_add_user_lambda" {
  api_id           = aws_apigatewayv2_api.my_http_api.id
  integration_type = "AWS_PROXY"
  integration_uri  = aws_lambda_function.admin_add_user_lambda.invoke_arn
}

# New route for the login function
resource "aws_apigatewayv2_route" "admin_add_user_route" {
  api_id    = aws_apigatewayv2_api.my_http_api.id
  route_key = "POST /adduser"
  target    = "integrations/${aws_apigatewayv2_integration.admin_add_user_lambda.id}"
}

resource "aws_apigatewayv2_stage" "default_stage" {
  api_id      = aws_apigatewayv2_api.my_http_api.id
  name        = "$default"
  auto_deploy = true

  depends_on = [
    aws_apigatewayv2_route.lambda_route,
    aws_apigatewayv2_route.login_route,
    aws_apigatewayv2_route.get_user_route,
    aws_apigatewayv2_route.admin_add_user_route,
  ]
}
