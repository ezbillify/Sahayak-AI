const { CognitoIdentityProviderClient, ConfirmForgotPasswordCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email, code, newPassword } = JSON.parse(event.body);

    // Confirm password reset with code
    await cognitoClient.send(new ConfirmForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      ConfirmationCode: code,
      Password: newPassword
    }));

    return {
      statusCode: 200,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({
        success: true,
        message: 'Password reset successful'
      })
    };

  } catch (error) {
    console.error('Reset password error:', error);
    
    let message = 'Failed to reset password';
    if (error.name === 'CodeMismatchException') {
      message = 'Invalid verification code';
    } else if (error.name === 'ExpiredCodeException') {
      message = 'Verification code has expired';
    } else if (error.name === 'InvalidPasswordException') {
      message = 'Password does not meet requirements';
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
