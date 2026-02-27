const { BedrockRuntimeClient, InvokeModelCommand } = require('@aws-sdk/client-bedrock-runtime');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, GetCommand, UpdateCommand } = require('@aws-sdk/lib-dynamodb');
const { detectFormType } = require('./detectFormType');

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

    // First, detect form type using our database
    const formDetection = detectFormType(document.extractedText);
    
    let detectedFormInfo = '';
    if (formDetection.detectedForm) {
      detectedFormInfo = `\n\nPre-detected Form Information:
- Form Name: ${formDetection.detectedForm.name}
- Category: ${formDetection.detectedForm.category}
- Authority: ${formDetection.detectedForm.authority}
- Expected Fields: ${formDetection.detectedForm.fields.join(', ')}
- Detection Confidence: ${formDetection.confidence}%

Please verify this detection is correct based on the document text.`;
    }

    // Create improved prompt for Bedrock with better form detection
    const prompt = `You are an expert AI assistant specializing in Indian government and bank documents. Analyze this document carefully.${detectedFormInfo}

Document Text:
${document.extractedText}

IMPORTANT: Carefully identify the EXACT document type by looking for specific keywords, form numbers, and headers:
- Aadhaar forms: Look for "UIDAI", "Aadhaar", "UID", "Unique Identification"
- PAN forms: Look for "PAN", "Permanent Account Number", "Form 49A", "Income Tax"
- GST forms: Look for "GST", "GSTIN", "Goods and Services Tax", "GSTR"
- Bank forms: Look for bank names, "Account Opening", "KYC", "IFSC"
- Passport forms: Look for "Passport", "MEA", "Ministry of External Affairs"
- Driving License: Look for "DL", "Driving License", "RTO", "Transport"
- Voter ID: Look for "EPIC", "Election Commission", "Voter"

Analyze and provide:
1. Document Type: Be VERY specific (e.g., "Aadhaar Update Form", "PAN Card Application Form 49A", "GST Registration Form GST REG-01")
2. Form Number/Code: If present (e.g., "Form 49A", "GST REG-01", "Aadhaar Update Form")
3. Summary: Explain in simple ${language} language what this document is for
4. Key Information: Extract important details like names, numbers, dates
5. Required Actions: What the user needs to do
6. Important Fields: List fields that must be filled
7. Deadlines: Any time-sensitive information

Respond in JSON format with keys: documentType, formNumber, summary, keyInformation, requiredActions, importantFields, deadlines`;

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
      UpdateExpression: 'SET aiAnalysis = :analysis, analyzedDate = :date, detectedForm = :form',
      ExpressionAttributeValues: {
        ':analysis': analysis,
        ':date': new Date().toISOString(),
        ':form': formDetection.detectedForm
      }
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        documentId,
        fileName: document.fileName,
        analysis,
        detectedForm: formDetection.detectedForm,
        detectionConfidence: formDetection.confidence,
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
