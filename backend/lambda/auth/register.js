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
    const emailTemplates = require('./sendEmail');
    const verificationCode = signUpResponse.CodeDeliveryDetails?.Destination || 'Check your email';
    const emailTemplate = emailTemplates.getVerificationEmailTemplate(verificationCode, name);
    
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
