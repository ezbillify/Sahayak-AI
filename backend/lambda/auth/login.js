const { CognitoIdentityProviderClient, InitiateAuthCommand, GetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    // Authenticate user
    const authResponse = await cognitoClient.send(new InitiateAuthCommand({
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        USERNAME: email,
        PASSWORD: password
      }
    }));

    const accessToken = authResponse.AuthenticationResult.AccessToken;
    const idToken = authResponse.AuthenticationResult.IdToken;
    const refreshToken = authResponse.AuthenticationResult.RefreshToken;

    // Get user details
    const userResponse = await cognitoClient.send(new GetUserCommand({
      AccessToken: accessToken
    }));

    // Extract user attributes
    const attributes = {};
    userResponse.UserAttributes.forEach(attr => {
      attributes[attr.Name] = attr.Value;
    });

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        tokens: {
          accessToken,
          idToken,
          refreshToken
        },
        user: {
          userId: attributes.sub, // Cognito user ID
          email: attributes.email,
          name: attributes.name,
          phone: attributes.phone_number,
          userType: attributes['custom:user_type'],
          language: attributes['custom:language'],
          isAdmin: attributes['custom:is_admin'] === 'true'
        }
      })
    };

  } catch (error) {
    console.error('Login error:', error);
    
    let message = 'Login failed';
    if (error.name === 'NotAuthorizedException') {
      message = 'Incorrect email or password';
    } else if (error.name === 'UserNotFoundException') {
      message = 'User not found';
    }

    return {
      statusCode: 401,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: false,
        error: message 
      })
    };
  }
};
