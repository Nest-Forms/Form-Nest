import { CognitoIdentityProviderClient, AdminCreateUserCommand } from "@aws-sdk/client-cognito-identity-provider";

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    try {
        const { firstName, lastName, email, companyId, role } = JSON.parse(event.body);
        
        const command = new AdminCreateUserCommand({
            UserPoolId: process.env.USER_POOL_ID,
            Username: email,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'name', Value: `${firstName} ${lastName}` },
                { Name: 'custom:companyId', Value: companyId },
                { Name: 'custom:role', Value: role },
            ],
            DesiredDeliveryMediums: ['EMAIL'],
        });
        
        const response = await client.send(command);
        
        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'User created successfully.',
                userDetails: response.User,
            }),
        };
    } catch (error) {
        console.log(error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: 'Failed to create user.',
                error: error.message,
            }),
        };
    }
};
