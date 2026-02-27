const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    // Get forms from DynamoDB
    const response = await docClient.send(new ScanCommand({
      TableName: process.env.FORMS_TABLE,
      Limit: 100
    }));

    const forms = (response.Items || []).map(form => ({
      id: form.formId,
      name: form.name,
      category: form.category,
      authority: form.authority,
      keywords: form.keywords || [],
      fields: form.fields || [],
      isCustom: form.isCustom || false
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        forms,
        total: forms.length
      })
    };

  } catch (error) {
    console.error('Error getting forms:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        error: 'Failed to get forms',
        forms: [],
        total: 0
      })
    };
  }
};
