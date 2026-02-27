const { CognitoIdentityProviderClient, ForgotPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    // Initiate forgot password flow
    await cognitoClient.send(new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: 'Password reset code sent to your email'
      })
    };

  } catch (error) {
    console.error('Forgot password error:', error);
    
    let message = 'Failed to send reset code';
    if (error.name === 'UserNotFoundException') {
      message = 'User not found';
    } else if (error.name === 'LimitExceededException') {
      message = 'Too many requests. Please try again later';
    }

    return {
      statusCode: 400,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ 
        success: false,
        error: message 
      })
    };
  }
};
