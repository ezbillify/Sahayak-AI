const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const userId = event.queryStringParameters?.userId;

    if (!userId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'userId is required' })
      };
    }

    const result = await docClient.send(new QueryCommand({
      TableName: process.env.COMPLIANCE_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      }
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ compliance: result.Items || [] })
    };
  } catch (error) {
    console.error('Error fetching user compliance:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to fetch compliance' })
    };
  }
};
