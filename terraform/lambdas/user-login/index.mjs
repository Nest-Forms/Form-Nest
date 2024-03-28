import { 
    CognitoIdentityProviderClient, 
    InitiateAuthCommand,
    AdminGetUserCommand // Import AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";

// Initialize the Cognito client
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    try {
        const body = JSON.parse(event.body);
        const { email, password } = body;

        const params = {
            AuthFlow: 'USER_PASSWORD_AUTH',
            ClientId: process.env.CLIENT_ID,
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password,
            },
        };

        // Initiate the authentication request
        const authResponse = await cognitoClient.send(new InitiateAuthCommand(params));

        if (authResponse.AuthenticationResult) {
            // Fetch user attributes, including companyId, after successful authentication
            const userAttributesResponse = await cognitoClient.send(new AdminGetUserCommand({
                UserPoolId: process.env.USER_POOL_ID,
                Username: email,
            }));

            // Find the companyId attribute
            const companyIdAttribute = userAttributesResponse.UserAttributes.find(attr => attr.Name === 'custom:companyId');
            const companyId = companyIdAttribute ? companyIdAttribute.Value : null;

            // Return authentication result along with companyId
            return {
                statusCode: 200,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: "Authentication successful",
                    data: authResponse.AuthenticationResult,
                    companyId, // Include companyId in the response
                }),
            };
        } else {
            // If authentication result is not present
            throw new Error('Authentication failed');
        }
    } catch (error) {
        console.error("Authentication error:", error);
        return {
            statusCode: 401,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Authentication failed",
                error: error.name,
                errorMessage: error.message,
            }),
        };
    }
};
