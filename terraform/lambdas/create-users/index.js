// Importing AWS SDK v3 packages
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from "@aws-sdk/lib-dynamodb";
import { CognitoIdentityProviderClient, SignUpCommand } from "@aws-sdk/client-cognito-identity-provider";
import { randomUUID } from 'crypto';

// Initialize AWS SDK v3 clients
const dbClient = new DynamoDBClient({ region: process.env.REGION });
const dynamoDbClient = DynamoDBDocumentClient.from(dbClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler = async (event) => {
    try {
        const { email, password, firstName, lastName, companyName, role } = JSON.parse(event.body);

        // Check if the company exists or create a new one
        let companyId = await checkOrCreateCompany(companyName);

        // Register the user in Cognito User Pool
        const signUpResponse = await cognitoClient.send(new SignUpCommand({
            ClientId: process.env.USER_POOL_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                { Name: 'email', Value: email },
                { Name: 'custom:firstName', Value: firstName },
                { Name: 'custom:lastName', Value: lastName },
                { Name: 'custom:companyId', Value: companyId },
                { Name: 'custom:role', Value: role },
            ]
        }));

        // Assuming the user registration in Cognito was successful, create a user item in DynamoDB
        await createUserItem(companyId, signUpResponse.UserSub, firstName, lastName, email);

        return {
            statusCode: 200,
            body: JSON.stringify({ message: "User registration successful", userSub: signUpResponse.UserSub }),
        };
    } catch (error) {
        console.error('Registration error:', error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                message: "User registration failed",
                error: JSON.stringify(error, Object.getOwnPropertyNames(error))
            }),
        };
    }
};

async function checkOrCreateCompany(companyName) {
    const queryResponse = await dynamoDbClient.send(new QueryCommand({
        TableName: process.env.TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
            ":pk": `COMPANY#${companyName}`,
        }
    }));

    if (queryResponse.Items && queryResponse.Items.length > 0) {
        return queryResponse.Items[0].PK.split("#")[1];
    } else {
        const newCompanyId = randomUUID();
        await dynamoDbClient.send(new PutCommand({
            TableName: process.env.TABLE_NAME,
            Item: {
                PK: `COMPANY#${newCompanyId}`,
                SK: `#METADATA#${newCompanyId}`,
                CompanyName: companyName
            }
        }));
        return newCompanyId;
    }
}

async function createUserItem(companyId, userId, firstName, lastName, email, role) {
    await dynamoDbClient.send(new PutCommand({
        TableName: process.env.TABLE_NAME,
        Item: {
            PK: `COMPANY#${companyId}`,
            SK: `USER#${userId}`,
            FirstName: firstName,
            LastName: lastName,
            Email: email,
            Role: role
        }
    }));
}
