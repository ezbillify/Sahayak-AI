const { CognitoIdentityProviderClient, ForgotPasswordCommand, AdminGetUserCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email } = JSON.parse(event.body);

    // Get user details for personalization
    let userName = '';
    try {
      const userResponse = await cognitoClient.send(new AdminGetUserCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email
      }));
      const nameAttr = userResponse.UserAttributes.find(attr => attr.Name === 'name');
      userName = nameAttr ? nameAttr.Value : '';
    } catch (error) {
      console.error('Error getting user details:', error);
    }

    // Initiate forgot password flow
    const response = await cognitoClient.send(new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    }));

    // Send custom password reset email via our email service
    const emailService = require('../email/sendEmail');
    const code = 'Check your email'; // Cognito sends the actual code
    const emailTemplate = emailService.getPasswordResetEmailTemplate(code, userName);
    
    try {
      await lambdaClient.send(new InvokeCommand({
        FunctionName: process.env.EMAIL_FUNCTION_NAME,
        InvocationType: 'Event', // Async
        Payload: JSON.stringify({
          to: email,
          subject: emailTemplate.subject,
          html: emailTemplate.html,
          text: emailTemplate.text
        })
      }));
    } catch (emailError) {
      console.error('Error sending custom email:', emailError);
      // Continue anyway, Cognito will send default email
    }

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
