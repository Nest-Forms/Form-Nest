import { CognitoIdentityProviderClient, AdminInitiateAuthCommand, AdminGetUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const REGION = process.env.REGION; // Your AWS region
const USER_POOL_ID = process.env.USER_POOL_ID; // Your Cognito User Pool ID
const CLIENT_ID = process.env.CLIENT_ID; // Your Cognito User Pool Client ID

const cognitoClient = new CognitoIdentityProviderClient({ region: REGION });

export const handler = async (event) => {
    try {
        const { username, password } = JSON.parse(event.body);
        
        // Authenticate the user with Cognito
        const authParams = {
            AuthFlow: 'ADMIN_NO_SRP_AUTH',
            ClientId: CLIENT_ID,
            UserPoolId: USER_POOL_ID,
            AuthParameters: {
                USERNAME: username,
                PASSWORD: password,
            },
        };

        const authResponse = await cognitoClient.send(new AdminInitiateAuthCommand(authParams));
        
        if (!authResponse.AuthenticationResult) {
            throw new Error('Authentication failed');
        }
        
        // Retrieve user attributes including companyId
        const userParams = {
            UserPoolId: USER_POOL_ID,
            Username: username,
        };
        
        const userResponse = await cognitoClient.send(new AdminGetUserCommand(userParams));
        
        // Extract companyId from the user attributes
        const companyIdAttribute = userResponse.UserAttributes.find(attr => attr.Name === 'custom:companyId');
        const companyId = companyIdAttribute ? companyIdAttribute.Value : null;

        return {
            statusCode: 200,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: "Authentication successful",
                userDetails: {
                    username: userResponse.Username,
                    companyId,
                    // Include any other user details you need
                },
            }),
        };
    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: error.statusCode || 500,
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ error: error.message }),
        };
    }
};
