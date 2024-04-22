data "archive_file" "create_users_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/create-users"
  output_path = "${path.module}/lambdas/create-users.zip"
}

data "archive_file" "user_login_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/user-login"
  output_path = "${path.module}/lambdas/user-login.zip"
}

data "archive_file" "get_user_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/get-user"
  output_path = "${path.module}/lambdas/get-user.zip"
}

data "archive_file" "admin_add_user_lambda_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/admin-add-user"
  output_path = "${path.module}/lambdas/admin-add-user.zip"
}

data "archive_file" "change_password_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/change-password"
  output_path = "${path.module}/lambdas/change-password.zip"
}

data "archive_file" "email_verification_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/email-verification"
  output_path = "${path.module}/lambdas/email-verification.zip"
}

data "archive_file" "resend_verification_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/resend-verification"
  output_path = "${path.module}/lambdas/resend-verification.zip"
}

data "archive_file" "initiate_pw_reset_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/initiate-password-reset"
  output_path = "${path.module}/lambdas/initiate-password-reset.zip"
}

data "archive_file" "confirm_pw_reset_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/confirm-password-reset"
  output_path = "${path.module}/lambdas/confirm-password-reset.zip"
}

data "archive_file" "force_password_change_reset_zip" {
  type        = "zip"
  source_dir  = "${path.module}/lambdas/force-password-change"
  output_path = "${path.module}/lambdas/force-password-change.zip"
}

resource "aws_lambda_function" "force_password_change_lambda" {
  function_name    = "nest-force-password-change"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/force-password-change.zip"
  source_code_hash = filebase64sha256(data.archive_file.force_password_change_reset_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.force_password_change_reset_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "confirm_pw_reset_lambda" {
  function_name    = "nest-confirm-password-reset"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/confirm-password-reset.zip"
  source_code_hash = filebase64sha256(data.archive_file.confirm_pw_reset_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.confirm_pw_reset_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "initiate_pw_reset_lambda" {
  function_name    = "nest-initiate-password-reset"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/initiate-password-reset.zip"
  source_code_hash = filebase64sha256(data.archive_file.initiate_pw_reset_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.initiate_pw_reset_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "resend_verification_lambda" {
  function_name    = "nest-resend-verification"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/resend-verification.zip"
  source_code_hash = filebase64sha256(data.archive_file.resend_verification_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.resend_verification_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "email_verification_lambda" {
  function_name    = "nest-email-verification"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/email-verification.zip"
  source_code_hash = filebase64sha256(data.archive_file.email_verification_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.email_verification_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "change_password_lambda" {
  function_name    = "nest-change-password"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/change-password.zip"
  source_code_hash = filebase64sha256(data.archive_file.change_password_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.change_password_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "admin_add_user_lambda" {
  function_name    = "nest-admin-add-user"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/admin-add-user.zip"
  source_code_hash = filebase64sha256(data.archive_file.admin_add_user_lambda_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.admin_add_user_lambda_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "get_user_lambda" {
  function_name    = "nest-get-user"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/get-user.zip"
  source_code_hash = filebase64sha256(data.archive_file.get_user_lambda_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.get_user_lambda_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_lambda_function" "user_management_lambda" {
  function_name    = "UserManagementFunction"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/create-users.zip"
  source_code_hash = filebase64sha256(data.archive_file.create_users_lambda_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.create_users_lambda_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool_client.my_user_pool_client.id
      TABLE_NAME   = aws_dynamodb_table.company_table.name
    }
  }
}

resource "aws_lambda_function" "user_login_lambda" {
  function_name    = "UserLoginAuth"
  handler          = "index.handler"
  role             = aws_iam_role.lambda_exec_role.arn
  runtime          = "nodejs20.x"
  filename         = "${path.module}/lambdas/user-login.zip"
  source_code_hash = filebase64sha256(data.archive_file.user_login_lambda_zip.output_path)
  timeout          = 10

  depends_on = [data.archive_file.user_login_lambda_zip]

  environment {
    variables = {
      REGION       = var.region
      USER_POOL_ID = aws_cognito_user_pool.my_user_pool.id
      CLIENT_ID    = aws_cognito_user_pool_client.my_user_pool_client.id
    }
  }
}

resource "aws_iam_role" "lambda_exec_role" {
  name = "lambda_exec_role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = "sts:AssumeRole",
        Effect = "Allow",
        Principal = {
          Service = "lambda.amazonaws.com"
        },
      },
    ],
  })
}

resource "aws_iam_role_policy" "lambda_policy" {
  name = "lambda_policy"
  role = aws_iam_role.lambda_exec_role.id

  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Action = [
          "cognito-idp:*",
          "dynamodb:*",
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ],
        Effect   = "Allow",
        Resource = "*"
      },
    ],
  })
}

resource "aws_lambda_permission" "api_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApi"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_management_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/*/*"
}

resource "aws_lambda_permission" "api_login_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.user_login_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/login"
}

resource "aws_lambda_permission" "get_user_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.get_user_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/getuser"
}

resource "aws_lambda_permission" "admin_add_user_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.admin_add_user_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/adduser"
}

resource "aws_lambda_permission" "change_password_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.change_password_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/changepassword"
}

resource "aws_lambda_permission" "email_verification_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.email_verification_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/verify-email"
}

resource "aws_lambda_permission" "resend_verification_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.resend_verification_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/resend-verification"
}

resource "aws_lambda_permission" "initiate_pw_reset_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.initiate_pw_reset_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/initiate-pw-reset"
}

resource "aws_lambda_permission" "confirm_pw_reset_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.confirm_pw_reset_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/confirm-pw-reset"
}

resource "aws_lambda_permission" "force_password_change_lambda_permission" {
  statement_id  = "AllowExecutionFromHttpApiForLogin"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.force_password_change_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.my_http_api.execution_arn}/$default/POST/force-pw-change"
}