# Authentication & Admin Setup Guide

## Overview

Sahayak AI now has full authentication powered by AWS Cognito with:
- User registration with email verification
- Secure login with JWT tokens
- Forgot password with email verification codes
- Admin user management
- Role-based access control

## Admin Account Setup

### Step 1: Register Admin Account

1. Go to: https://sahayak-ai-jet.vercel.app/register
2. Fill in the registration form with:
   - **Email**: `admin@ezbillify.com` (IMPORTANT: Must be this exact email)
   - **Name**: Your name
   - **Password**: Choose a strong password (min 8 characters, uppercase, lowercase, numbers)
   - **User Type**: Any
   - **Language**: Any

3. Click "Create Account"
4. Check your email for verification code (if Cognito email is configured)

### Step 2: Login as Admin

1. Go to: https://sahayak-ai-jet.vercel.app/login
2. Enter:
   - **Email**: `admin@ezbillify.com`
   - **Password**: Your password
3. Click "Login"
4. **You will be automatically redirected to `/admin` dashboard**

### Step 3: Access Admin Features

Once logged in as admin:
- The "Admin" link appears in the header (purple color)
- You have access to all admin features:
  - User management
  - Document tracking
  - Form database management
  - AI training controls
  - Analytics dashboard

## Regular User Flow

### Registration
1. Go to `/register`
2. Fill in details with any email (except admin@ezbillify.com)
3. Verify email (if configured)
4. Login redirects to `/dashboard`

### Login
1. Go to `/login`
2. Enter credentials
3. Regular users → `/dashboard`
4. Admin users → `/admin`

### Forgot Password
1. Go to `/login`
2. Click "Forgot Password?"
3. Enter your email
4. Check email for 6-digit verification code
5. Enter code and new password
6. Login with new password

## API Endpoints

All authentication endpoints are deployed:

### POST /auth/register
Register a new user
```json
{
  "email": "user@example.com",
  "password": "SecurePass123",
  "name": "John Doe",
  "phone": "+919876543210",
  "userType": "business",
  "language": "english"
}
```

### POST /auth/login
Login user
```json
{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

Response:
```json
{
  "success": true,
  "tokens": {
    "accessToken": "...",
    "idToken": "...",
    "refreshToken": "..."
  },
  "user": {
    "email": "user@example.com",
    "name": "John Doe",
    "isAdmin": false
  }
}
```

### POST /auth/forgot-password
Request password reset
```json
{
  "email": "user@example.com"
}
```

### POST /auth/reset-password
Reset password with code
```json
{
  "email": "user@example.com",
  "code": "123456",
  "newPassword": "NewSecurePass123"
}
```

## AWS Cognito Configuration

The backend automatically creates:
- **User Pool**: `sahayak-ai-users-prod`
- **User Pool Client**: `sahayak-ai-client-prod`
- **Admin Group**: `Admins` (admin@ezbillify.com is auto-added)

### Custom Attributes
- `custom:user_type` - student, freelancer, business, individual
- `custom:language` - preferred language
- `custom:is_admin` - true/false flag

## Security Features

1. **Password Requirements**:
   - Minimum 8 characters
   - At least 1 uppercase letter
   - At least 1 lowercase letter
   - At least 1 number

2. **Email Verification**:
   - Required for new accounts
   - Prevents fake registrations

3. **JWT Tokens**:
   - Access token for API calls
   - Refresh token for session renewal
   - ID token for user info

4. **Admin Protection**:
   - Only `admin@ezbillify.com` gets admin access
   - Admin routes are protected
   - Admin group in Cognito

## Testing

### Test Regular User
1. Register with any email
2. Login → Should go to `/dashboard`
3. Header shows: Dashboard, Upload, Compliance, Logout

### Test Admin User
1. Register with `admin@ezbillify.com`
2. Login → Should go to `/admin`
3. Header shows: Dashboard, Upload, Compliance, **Admin**, Logout

### Test Forgot Password
1. Click "Forgot Password?" on login
2. Enter email
3. Check email for code
4. Enter code and new password
5. Login with new password

## Troubleshooting

### Email not received
- Check spam folder
- Verify Cognito email configuration in AWS Console
- For testing, use AWS Console to manually verify users

### Admin not working
- Ensure email is exactly `admin@ezbillify.com`
- Check browser localStorage for `userData.isAdmin = true`
- Clear cache and login again

### Password reset not working
- Ensure code is entered correctly (6 digits)
- Code expires after 1 hour
- Request new code if expired

## Production Checklist

- [ ] Configure custom email domain in Cognito
- [ ] Set up SES for production email sending
- [ ] Enable MFA for admin accounts
- [ ] Set up CloudWatch alarms for failed logins
- [ ] Configure password rotation policy
- [ ] Enable Cognito advanced security features
- [ ] Set up audit logging for admin actions
- [ ] Configure CORS properly for production domain
- [ ] Add rate limiting for auth endpoints
- [ ] Set up backup admin email

## Environment Variables

Add to frontend `.env.production`:
```
VITE_API_URL=https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod
```

Backend environment variables (auto-configured):
```
COGNITO_USER_POOL_ID=<auto-generated>
COGNITO_CLIENT_ID=<auto-generated>
```
