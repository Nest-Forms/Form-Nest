import { CognitoIdentityProviderClient, ResendConfirmationCodeCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    const { email } = JSON.parse(event.body);

    const params = {
        ClientId: process.env.CLIENT_ID,
        Username: email,
    };

    try {
        await client.send(new ResendConfirmationCodeCommand(params));
        return {
            statusCode: 200,
            body: JSON.stringify({ message: "Verification code sent." }),
        };
    } catch (error) {
        console.error("Error resending verification code:", error);
        return {
            statusCode: error.statusCode || 500,
            body: JSON.stringify({ error: "Failed to resend verification code." }),
        };
    }
};
