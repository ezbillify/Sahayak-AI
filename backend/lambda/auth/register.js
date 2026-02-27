const { CognitoIdentityProviderClient, SignUpCommand, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');

const cognitoClient = new CognitoIdentityProviderClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { email, password, name, phone, userType, language } = JSON.parse(event.body);

    // Check if this is admin email
    const isAdmin = email === 'admin@ezbillify.com';

    // Register user in Cognito
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
