const { CognitoIdentityProviderClient, ListUsersCommand, AdminListGroupsForUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand } = require('@aws-sdk/lib-dynamodb');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);

exports.handler = async (event) => {
  try {
    // Get all users from Cognito
    const usersResponse = await cognitoClient.send(new ListUsersCommand({
      UserPoolId: process.env.COGNITO_USER_POOL_ID,
      Limit: 60
    }));

    const users = await Promise.all(usersResponse.Users.map(async (user) => {
      // Extract attributes
      const attributes = {};
      user.Attributes.forEach(attr => {
        attributes[attr.Name] = attr.Value;
      });

      // Get user's groups
      let isAdmin = false;
      try {
        const groupsResponse = await cognitoClient.send(new AdminListGroupsForUserCommand({
          UserPoolId: process.env.COGNITO_USER_POOL_ID,
          Username: user.Username
        }));
        isAdmin = groupsResponse.Groups.some(g => g.GroupName === 'Admins');
      } catch (error) {
        console.error('Error getting user groups:', error);
      }

      // Count documents uploaded by this user
      let documentsUploaded = 0;
      try {
        const docsResponse = await docClient.send(new QueryCommand({
          TableName: process.env.DOCUMENTS_TABLE,
          IndexName: 'UserIdIndex',
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': user.Username
          },
          Select: 'COUNT'
        }));
        documentsUploaded = docsResponse.Count || 0;
      } catch (error) {
        console.error('Error counting documents:', error);
      }

      return {
        id: user.Username,
        name: attributes.name || 'N/A',
        email: attributes.email,
        phone: attributes.phone_number,
        userType: attributes['custom:user_type'] || 'individual',
        language: attributes['custom:language'] || 'english',
        isAdmin,
        lastLogin: user.UserLastModifiedDate || user.UserCreateDate,
        createdDate: user.UserCreateDate,
        status: user.UserStatus === 'CONFIRMED' ? 'active' : 'inactive',
        documentsUploaded
      };
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        users,
        total: users.length
      })
    };

  } catch (error) {
    console.error('Error getting users:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to get users' })
    };
  }
};
