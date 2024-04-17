import { CognitoIdentityProviderClient, ForgotPasswordCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);
    const command = new ForgotPasswordCommand({
      ClientId: process.env.CLIENT_ID,
      Username: email,
    });

    await client.send(command);
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Verification code sent." }),
    };
  } catch (error) {
    console.error(error);
    return {
      statusCode: error.$metadata.httpStatusCode || 500,
      body: JSON.stringify({ error: error.name, message: error.message }),
    };
  }
};
