const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { email, name, phone, userType, language } = JSON.parse(event.body);

    const userId = uuidv4();
    const user = {
      userId,
      email,
      name,
      phone,
      userType, // student, freelancer, business, etc.
      preferences: {
        language: language || 'english',
        notifications: true,
        theme: 'light'
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.USERS_TABLE,
      Item: user
    }));

    return {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ userId, message: 'User created successfully' })
    };
  } catch (error) {
    console.error('Error creating user:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to create user' })
    };
  }
};
