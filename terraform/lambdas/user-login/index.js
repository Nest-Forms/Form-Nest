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

        // Check if there is a challenge which might include the user needing to confirm their account
        if (authResponse.ChallengeName) {
            if (authResponse.ChallengeName === 'NEW_PASSWORD_REQUIRED') {
                return {
                    statusCode: 200,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        challengeName: authResponse.ChallengeName,
                        session: authResponse.Session,
                    }),
                };
            }
            // Specific status for UserNotConfirmed
            if (authResponse.ChallengeName === 'USER_NOT_CONFIRMED') {
                return {
                    statusCode: 403, // Or use 401 depending on your design decision
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        challengeName: 'USER_NOT_CONFIRMED',
                    }),
                };
            }
        }

        // Fetch user attributes if no challenge is present
        const userAttributesResponse = await cognitoClient.send(new AdminGetUserCommand({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
        }));

        const attributes = userAttributesResponse.UserAttributes.reduce((acc, attr) => {
            acc[attr.Name.replace('custom:', '')] = attr.Value;
            return acc;
        }, {});

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
        return {
            statusCode: error.$metadata.httpStatusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Authentication failed",
                error: error.name,
                error_description: error.message
            })
        };
    }
};
