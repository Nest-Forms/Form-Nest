// Import AWS SDK for JavaScript v3 packages
import { CognitoIdentityProviderClient, ConfirmSignUpCommand } from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Amazon Cognito service client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    try {
        const { email, code } = JSON.parse(event.body);
        const userPoolId = process.env.USER_POOL_ID; // Ensure this is set in your Lambda's environment variables

        // Prepare parameters for the ConfirmSignUp command
        const params = {
            ClientId: process.env.CLIENT_ID, // Also set this in your environment variables
            Username: email,
            ConfirmationCode: code,
        };

        // Execute the ConfirmSignUp command
        await cognitoClient.send(new ConfirmSignUpCommand(params));

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: "Email verified successfully" }),
        };
    } catch (error) {
        console.error('Email verification error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: "Failed to verify email", details: error.message }),
        };
    }
};
