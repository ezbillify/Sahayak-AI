const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');
const { TextractClient, DetectDocumentTextCommand } = require('@aws-sdk/client-textract');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const s3Client = new S3Client({ region: process.env.AWS_REGION });
const textractClient = new TextractClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    // S3 event trigger
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    
    console.log(`Processing document: ${key}`);

    // Extract documentId from S3 key
    const documentId = key.split('/')[3];

    // Call Textract for OCR
    const textractResponse = await textractClient.send(new DetectDocumentTextCommand({
      Document: {
        S3Object: {
          Bucket: bucket,
          Name: key
        }
      }
    }));

    // Extract text from Textract response
    const extractedText = textractResponse.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Text)
      .join('\n');

    // Calculate confidence score
    const confidenceScores = textractResponse.Blocks
      .filter(block => block.BlockType === 'LINE')
      .map(block => block.Confidence);
    
    const avgConfidence = confidenceScores.length > 0
      ? confidenceScores.reduce((a, b) => a + b, 0) / confidenceScores.length
      : 0;

    // Update DynamoDB with OCR results
    await docClient.send(new UpdateCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      Key: { documentId },
      UpdateExpression: 'SET extractedText = :text, ocrStatus = :status, ocrConfidence = :confidence, processedDate = :date',
      ExpressionAttributeValues: {
        ':text': extractedText,
        ':status': 'completed',
        ':confidence': avgConfidence,
        ':date': new Date().toISOString()
      }
    }));

    console.log(`Document processed successfully: ${documentId}`);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Document processed successfully',
        documentId,
        confidence: avgConfidence
      })
    };

  } catch (error) {
    console.error('Error processing document:', error);
    throw error;
  }
};
