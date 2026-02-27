const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { CognitoIdentityProviderClient, ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    // Get total users from Cognito
    const usersResponse = await cognitoClient.send(new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID
    }));
    
    const totalUsers = usersResponse.Users.length;
    const activeUsers = usersResponse.Users.filter(u => u.UserStatus === 'CONFIRMED').length;

    // Get total documents from DynamoDB
    const documentsResponse = await docClient.send(new ScanCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      Select: 'COUNT'
    }));
    
    const totalDocuments = documentsResponse.Count || 0;

    // Get documents uploaded today
    const today = new Date().toISOString().split('T')[0];
    const todayDocsResponse = await docClient.send(new ScanCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      FilterExpression: 'begins_with(uploadDate, :today)',
      ExpressionAttributeValues: {
        ':today': today
      },
      Select: 'COUNT'
    }));
    
    const documentsToday = todayDocsResponse.Count || 0;

    // Calculate average accuracy from processed documents
    const processedDocs = await docClient.send(new ScanCommand({
      TableName: process.env.DOCUMENTS_TABLE,
      FilterExpression: 'attribute_exists(ocrConfidence)'
    }));

    let avgAccuracy = 0;
    if (processedDocs.Items && processedDocs.Items.length > 0) {
      const totalConfidence = processedDocs.Items.reduce((sum, doc) => 
        sum + (doc.ocrConfidence || 0), 0
      );
      avgAccuracy = (totalConfidence / processedDocs.Items.length).toFixed(1);
    }

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        totalUsers,
        activeUsers,
        totalDocuments,
        documentsToday,
        avgAccuracy: parseFloat(avgAccuracy),
        systemUptime: 99.9 // This would come from CloudWatch in production
      })
    };

  } catch (error) {
    console.error('Error getting stats:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get statistics' })
    };
  }
};
