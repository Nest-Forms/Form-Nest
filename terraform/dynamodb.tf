resource "aws_dynamodb_table" "company_table" {
  name         = "nest-forms-company-table"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "PK"
  range_key    = "SK"

  attribute {
    name = "PK"
    type = "S"
  }

  attribute {
    name = "SK"
    type = "S"
  }
}

# resource "aws_dynamodb_table" "users_table" {
#   name           = "nest-forms-users-table"
#   billing_mode   = "PAY_PER_REQUEST"
#   hash_key       = "user_id"

#   attribute {
#     name = "user_id"
#     type = "S"
#   }
# }