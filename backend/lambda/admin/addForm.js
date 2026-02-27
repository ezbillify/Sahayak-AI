const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { name, category, authority, keywords, fields } = JSON.parse(event.body);

    if (!name || !category || !authority) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const formId = uuidv4();
    const keywordsArray = keywords.split(',').map(k => k.trim()).filter(k => k);
    const fieldsArray = fields.split(',').map(f => f.trim()).filter(f => f);

    const form = {
      formId,
      name,
      category,
      authority,
      keywords: keywordsArray,
      fields: fieldsArray,
      createdDate: new Date().toISOString(),
      isCustom: true
    };

    await docClient.send(new PutCommand({
      TableName: process.env.FORMS_TABLE,
      Item: form
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: 'Form added successfully',
        form
      })
    };

  } catch (error) {
    console.error('Error adding form:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to add form' })
    };
  }
};
