import { CognitoIdentityProviderClient, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
  try {
    const { username, newPassword, session } = JSON.parse(event.body);

    const params = {
      ChallengeName: 'NEW_PASSWORD_REQUIRED',
      ClientId: process.env.CLIENT_ID,
      Session: session,
      ChallengeResponses: {
        USERNAME: username,
        NEW_PASSWORD: newPassword,
      },
    };
    console.log(params)

    await cognitoClient.send(new RespondToAuthChallengeCommand(params));
    return {
      statusCode: 200,
      body: JSON.stringify({ message: "Password updated successfully." }),
    };
  } catch (error) {
    console.error("Error responding to auth challenge:", error);
    return {
      statusCode: error.$metadata.httpStatusCode || 500,
      body: JSON.stringify({ error: error.name, message: error.message }),
    };
  }
};
