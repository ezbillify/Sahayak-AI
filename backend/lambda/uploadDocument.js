const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { v4: uuidv4 } = require('uuid');

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const { fileName, fileType, fileContent, userId } = JSON.parse(event.body);
    
    if (!fileName || !fileType || !fileContent || !userId) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const documentId = uuidv4();
    const s3Key = `users/${userId}/uploads/${documentId}/${fileName}`;
    
    // Decode base64 file content
    const buffer = Buffer.from(fileContent, 'base64');
    
    // Upload to S3
    await s3Client.send(new PutObjectCommand({
      Bucket: process.env.DOCUMENTS_BUCKET,
      Key: s3Key,
      Body: buffer,
      ContentType: fileType,
      ServerSideEncryption: 'AES256'
    }));

    // Save metadata to DynamoDB
    const documentMetadata = {
      documentId,
      userId,
      fileName,
      fileType,
      s3Key,
      uploadDate: new Date().toISOString(),
      status: 'uploaded',
      ocrStatus: 'pending'
    };

    await docClient.send(new PutCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      Item: documentMetadata
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        message: 'Document uploaded successfully',
        documentId,
        s3Key
      })
    };

  } catch (error) {
    console.error('Error uploading document:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to upload document' })
    };
  }
};
