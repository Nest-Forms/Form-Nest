import { 
    CognitoIdentityProviderClient, 
    InitiateAuthCommand,
    AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body);
        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };

        const authResponse = await cognitoClient.send(new InitiateAuthCommand(params));

        // Check for challenges in the response
        if (authResponse.ChallengeName) {
            // If there's a challenge, return it to the client to handle
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    challengeName: authResponse.ChallengeName,
                    session: authResponse.Session,
                    // Include other relevant data for handling the challenge
                }),
            };
        }

        // Fetch user attributes if no challenge is present
        const userAttributesResponse = await cognitoClient.send(new AdminGetUserCommand({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
        }));

        // Extract attributes
        const attributes = userAttributesResponse.UserAttributes.reduce((acc, attr) => {
            acc[attr.Name.replace('custom:', '')] = attr.Value;
            return acc;
        }, {});

        // Respond with user attributes if authentication is successful and no challenge was present
        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Authentication successful",
                data: authResponse.AuthenticationResult,
                userAttributes: attributes,
            }),
        };
    } catch (error) {
        console.error("Authentication error:", error);
        // Handle and respond with errors
    }
};
