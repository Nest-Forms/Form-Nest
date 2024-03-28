resource "aws_cognito_user_pool" "my_user_pool" {
  name = "nest-forms-user-pool"

  password_policy {
    minimum_length    = 8
    require_lowercase = true
    require_numbers   = true
    require_symbols   = true
    require_uppercase = true
    temporary_password_validity_days = 7
  }

  schema {
    name = "companyId"
    attribute_data_type = "String"
    mutable = true
    string_attribute_constraints {
      min_length = 1
      max_length = 256
    }
  }
  schema {
    name                = "firstName"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 30
    }
  }

  schema {
    name                = "lastName"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 30
    }
  }

  schema {
    name                = "role"
    attribute_data_type = "String"
    mutable             = true
    string_attribute_constraints {
      min_length = 1
      max_length = 20
    }
  }

  admin_create_user_config {
    allow_admin_create_user_only = false
  }

  auto_verified_attributes = ["email"]
}

resource "aws_cognito_user_pool_client" "my_user_pool_client" {
  name         = "my-app-client"
  user_pool_id = aws_cognito_user_pool.my_user_pool.id

  explicit_auth_flows = [
      "ALLOW_ADMIN_USER_PASSWORD_AUTH", 
      "ALLOW_USER_PASSWORD_AUTH", 
      "ALLOW_REFRESH_TOKEN_AUTH"
    ]
  }
