import { CognitoIdentityProviderClient, AdminCreateUserCommand, AdminUpdateUserAttributesCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
  try {
    const { email, firstName, lastName, role, companyId } = JSON.parse(event.body);
    const userPoolId = process.env.USER_POOL_ID;
    
    // Create user
    const createUserParams = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "custom:firstName", Value: firstName },
        { Name: "custom:lastName", Value: lastName },
        { Name: "custom:role", Value: role },
        { Name: "custom:companyId", Value: companyId }
      ],
      DesiredDeliveryMediums: ["EMAIL"]
    };
    await cognitoClient.send(new AdminCreateUserCommand(createUserParams));

    // Automatically verify email
    const verifyEmailParams = {
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: "email_verified", Value: "true" }
      ]
    };
    await cognitoClient.send(new AdminUpdateUserAttributesCommand(verifyEmailParams));

    return {
      statusCode: 200,
      body: JSON.stringify({ message: "User created and email verified successfully" }),
    };
  } catch (error) {
    console.error("Error creating user:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to create user" }),
    };
  }
};
