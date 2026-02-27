const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');

const bedrockClient = new BedrockRuntimeClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    const documentId = event.pathParameters.documentId;
    const language = event.queryStringParameters?.language || 'english';

    // Get document from DynamoDB
    const result = await docClient.send(new GetCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      Key: { documentId }
    }));

    if (!result.Item) {
      return {
        statusCode: 404,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Document not found' })
      };
    }

    const document = result.Item;

    if (!document.extractedText) {
      return {
        statusCode: 400,
        headers: { 'Access-Control-Allow-Origin': '*' },
        body: JSON.stringify({ error: 'Document not yet processed' })
      };
    }

    // Create prompt for Bedrock
    const prompt = `You are an AI assistant helping Indian citizens understand government documents. 

Document Text:
${document.extractedText}

Please analyze this government document and provide:
1. Document Type (e.g., GST Form, PAN Application, License, etc.)
2. Summary in simple ${language} language
3. Key Information extracted
4. Required Actions or deadlines (if any)
5. Important fields that need to be filled (if it's a form)

Respond in JSON format with keys: documentType, summary, keyInformation, requiredActions, importantFields`;

    // Call Bedrock Claude 3.5 Sonnet
    const bedrockResponse = await bedrockClient.send(new InvokeModelCommand({
      modelId: 'anthropic.claude-3-5-sonnet-20241022-v2:0',
      contentType: 'application/json',
      accept: 'application/json',
      body: JSON.stringify({
        anthropic_version: 'bedrock-2023-05-31',
        max_tokens: 2000,
        messages: [{
          role: 'user',
          content: prompt
        }]
      })
    }));

    const responseBody = JSON.parse(new TextDecoder().decode(bedrockResponse.body));
    const aiAnalysis = responseBody.content[0].text;

    // Parse AI response
    let analysis;
    try {
      analysis = JSON.parse(aiAnalysis);
    } catch (e) {
      // If not valid JSON, wrap in object
      analysis = { explanation: aiAnalysis };
    }

    // Update document with AI analysis
    await docClient.send(new UpdateCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      Key: { documentId },
      UpdateExpression: 'SET aiAnalysis = :analysis, analyzedDate = :date',
      ExpressionAttributeValues: {
        ':analysis': analysis,
        ':date': new Date().toISOString()
      }
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        documentId,
        fileName: document.fileName,
        analysis,
        ocrConfidence: document.ocrConfidence
      })
    };

  } catch (error) {
    console.error('Error analyzing document:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to analyze document' })
    };
  }
};
