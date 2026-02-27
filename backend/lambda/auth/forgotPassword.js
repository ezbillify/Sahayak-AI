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

    // Initiate forgot password flow (Cognito will send the code via its default email)
    const response = await cognitoClient.send(new ForgotPasswordCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email
    }));

    // Send custom password reset email via our Gmail SMTP
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset Request</h1>
          </div>
          <div class="content">
            <p>Hi ${userName || 'there'},</p>
            <p>We received a request to reset your password for your Sahayak AI account.</p>
            <p>Please check your email for the verification code sent by AWS Cognito, or click the button below to reset your password:</p>
            <div style="text-align: center;">
              <a href="https://sahayak-ai-jet.vercel.app/forgot-password" class="button">Reset Password</a>
            </div>
            <p>If you didn't request this password reset, please ignore this email.</p>
            <p>Best regards,<br>The Sahayak AI Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Sahayak AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    try {
      await lambdaClient.send(new InvokeCommand({
        FunctionName: 'sahayak-ai-backend-prod-sendEmail',
        InvocationType: 'Event',
        Payload: JSON.stringify({
          body: JSON.stringify({
            to: email,
            subject: 'Reset Your Sahayak AI Password',
            html: emailHtml,
            text: `Hi ${userName || 'there'}, We received a request to reset your password. Please check your email for the verification code.`
          })
        })
      }));
    } catch (emailError) {
      console.error('Error sending custom email:', emailError);
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
