const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { complianceId, status } = JSON.parse(event.body);

    if (!complianceId || !status) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'complianceId and status are required' })
      };
    }

    await docClient.send(new UpdateCommand({
      TableName: process.env.COMPLIANCE_TABLE,
      Key: { complianceId },
      UpdateExpression: 'SET #status = :status, completedAt = :completedAt',
      ExpressionAttributeNames: {
        '#status': 'status'
      },
      ExpressionAttributeValues: {
        ':status': status,
        ':completedAt': status === 'completed' ? new Date().toISOString() : null
      }
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ message: 'Compliance updated successfully' })
    };
  } catch (error) {
    console.error('Error updating compliance:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to update compliance' })
    };
  }
};
