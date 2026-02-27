const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const userId = event.pathParameters.userId;
    const days = parseInt(event.queryStringParameters?.days || '30');

    const today = new Date();
    const futureDate = new Date();
    futureDate.setDate(today.getDate() + days);

    const result = await docClient.send(new QueryCommand({
      TableName: process.env.COMPLIANCE_TABLE,
      IndexName: 'UserIdIndex',
      KeyConditionExpression: 'userId = :userId AND dueDate BETWEEN :today AND :future',
      ExpressionAttributeValues: {
        ':userId': userId,
        ':today': today.toISOString(),
        ':future': futureDate.toISOString()
      }
    }));

    const deadlines = result.Items.sort((a, b) => 
      new Date(a.dueDate) - new Date(b.dueDate)
    );

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ deadlines, count: deadlines.length })
    };
  } catch (error) {
    console.error('Error getting deadlines:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get deadlines' })
    };
  }
};
