// Import necessary AWS SDK clients
import { CognitoIdentityProviderClient, RespondToAuthChallengeCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    // Parse the incoming event body
    const { session, newPassword, email } = JSON.parse(event.body);

    try {
        // Prepare the parameters for responding to the auth challenge
        const params = {
            ChallengeName: 'NEW_PASSWORD_REQUIRED',
            ClientId: process.env.COGNITO_CLIENT_ID, // Make sure to set this in your Lambda environment variables
            ChallengeResponses: {
                USERNAME: email, // USERNAME is the user's email in this case
                NEW_PASSWORD: newPassword,
            },
            Session: session, // This is the session token you received during the initial login attempt
        };

        // Use the Cognito client to respond to the auth challenge
        const response = await cognitoClient.send(new RespondToAuthChallengeCommand(params));

        // Return a success response
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Password changed successfully", data: response }),
        };
    } catch (error) {
        console.error("Error changing password:", error);
        return {
            statusCode: error.$metadata?.httpStatusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Failed to change password", error: error.message }),
        };
    }
};
