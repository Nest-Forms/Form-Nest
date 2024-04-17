import { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
  try {
    const { email, code, newPassword } = JSON.parse(event.body);
    const command = new ConfirmForgotPasswordCommand({
      ClientId: process.env.CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword,
    });

    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password reset successfully." }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.$metadata.httpStatusCode || 500,
      body: JSON.stringify({ error: error.name, message: error.message }),
    };
  }
};
