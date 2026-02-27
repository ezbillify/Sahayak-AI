const { CognitoIdentityProviderClient, SignUpCommand, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });
const lambdaClient = new LambdaClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email, password, name, phone, userType, language } = JSON.parse(event.body);

    // Check if this is admin email
    const isAdmin = email === 'admin@ezbillify.com';

    // Register user in Cognito (without auto-verification)
    const signUpResponse = await cognitoClient.send(new SignUpCommand({
      ClientId: process.env.COGNITO_CLIENT_ID,
      Username: email,
      Password: password,
      UserAttributes: [
        { Name: 'email', Value: email },
        { Name: 'name', Value: name },
        { Name: 'phone_number', Value: phone || '' },
        { Name: 'custom:user_type', Value: userType || 'individual' },
        { Name: 'custom:language', Value: language || 'english' },
        { Name: 'custom:is_admin', Value: isAdmin ? 'true' : 'false' }
      ]
    }));

    // If admin, add to admin group
    if (isAdmin) {
      await cognitoClient.send(new AdminAddUserToGroupCommand({
        UserPoolId: process.env.COGNITO_USER_POOL_ID,
        Username: email,
        GroupName: 'Admins'
      }));
    }

    // Send custom verification email via our email service
    const verificationCode = signUpResponse.CodeDeliveryDetails?.Destination || 'your email';
    
    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .code { background: #667eea; color: white; padding: 15px; font-size: 24px; font-weight: bold; text-align: center; border-radius: 5px; margin: 20px 0; letter-spacing: 2px; }
          .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Welcome to Sahayak AI!</h1>
          </div>
          <div class="content">
            <p>Hi ${name},</p>
            <p>Thank you for registering with Sahayak AI. To complete your registration, please verify your email address.</p>
            <p>Your verification code is:</p>
            <div class="code">${verificationCode}</div>
            <p>If you didn't create this account, please ignore this email.</p>
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
        InvocationType: 'Event', // Async
        Payload: JSON.stringify({
          body: JSON.stringify({
            to: email,
            subject: 'Verify Your Sahayak AI Account',
            html: emailHtml,
            text: `Welcome to Sahayak AI! Your verification code is: ${verificationCode}`
          })
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
        message: 'Registration successful. Please check your email to verify your account.',
        userSub: signUpResponse.UserSub
      })
    };

  } catch (error) {
    console.error('Registration error:', error);
    
    let message = 'Registration failed';
    if (error.name === 'UsernameExistsException') {
      message = 'User with this email already exists';
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
