const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { status } = event.queryStringParameters || {};

    let filterExpression = undefined;
    let expressionAttributeValues = undefined;

    if (status && status !== 'all') {
      filterExpression = '#status = :status';
      expressionAttributeValues = {
        ':status': status
      };
    }

    const response = await docClient.send(new ScanCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      FilterExpression: filterExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: filterExpression ? { '#status': 'status' } : undefined,
      Limit: 100
    }));

    const documents = (response.Items || []).map(doc => ({
      id: doc.documentId,
      fileName: doc.fileName,
      userId: doc.userId,
      userName: doc.userName || 'Unknown User',
      formType: doc.aiAnalysis?.documentType || 'Processing',
      uploadDate: doc.uploadDate,
      status: doc.status || 'uploaded',
      accuracy: doc.ocrConfidence ? Math.round(doc.ocrConfidence) : null,
      detectedForm: doc.detectedForm,
      s3Key: doc.s3Key
    }));

    // Sort by upload date (newest first)
    documents.sort((a, b) => new Date(b.uploadDate) - new Date(a.uploadDate));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        documents,
        total: documents.length
      })
    };

  } catch (error) {
    console.error('Error getting documents:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get documents' })
    };
  }
};
