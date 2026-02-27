# AWS Console Guide - View Registered Users

## How to View Registered Users in AWS Console

### Method 1: Using Cognito User Pool (Recommended)

1. **Go to AWS Console**: https://console.aws.amazon.com/
2. **Navigate to Cognito**:
   - Search for "Cognito" in the top search bar
   - Click "Amazon Cognito"

3. **Select Your User Pool**:
   - Click "User pools" in the left sidebar
   - Find and click: `sahayak-ai-users-prod`

4. **View Users**:
   - Click "Users" tab
   - You'll see a list of all registered users with:
     - Username (email)
     - Email address
     - Phone number
     - Account status (CONFIRMED, UNCONFIRMED, etc.)
     - Creation date
     - Last modified date

5. **View User Details**:
   - Click on any user's email
   - You'll see:
     - User attributes (name, email, phone, custom attributes)
     - User status
     - Groups (Admin group membership)
     - MFA settings
     - Devices
     - Sign-in history

6. **User Actions Available**:
   - Disable user
   - Delete user
   - Reset password
   - Confirm user (if unconfirmed)
   - Add to group
   - Edit attributes

### Method 2: Using DynamoDB (For Additional Data)

1. **Go to DynamoDB**:
   - Search for "DynamoDB" in AWS Console
   - Click "DynamoDB"

2. **View Users Table**:
   - Click "Tables" in left sidebar
   - Find: `sahayak-ai-users-prod`
   - Click "Explore table items"

3. **See User Data**:
   - View all user records
   - See custom fields like:
     - User type (student, freelancer, business)
     - Preferred language
     - Registration date
     - Last login

### Method 3: Using AWS CLI

```bash
# List all users
aws cognito-idp list-users \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --region ap-south-1

# Get specific user details
aws cognito-idp admin-get-user \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --username user@example.com \
  --region ap-south-1

# List users in Admin group
aws cognito-idp list-users-in-group \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --group-name Admins \
  --region ap-south-1
```

## Finding Your User Pool ID

### Option 1: From Serverless Deployment Output
After running `serverless deploy`, look for the CloudFormation outputs.

### Option 2: From AWS Console
1. Go to Cognito → User pools
2. Click on `sahayak-ai-users-prod`
3. The User Pool ID is shown at the top (format: `ap-south-1_XXXXXXXXX`)

### Option 3: From CloudFormation
1. Go to CloudFormation in AWS Console
2. Find stack: `sahayak-ai-backend-prod`
3. Click "Resources" tab
4. Find resource: `CognitoUserPool`
5. Click the Physical ID link

## User Attributes Explained

### Standard Attributes
- **sub**: Unique user ID (UUID)
- **email**: User's email address
- **email_verified**: true/false
- **name**: Full name
- **phone_number**: Phone with country code (+91...)
- **phone_number_verified**: true/false

### Custom Attributes
- **custom:user_type**: student, freelancer, business, individual
- **custom:language**: english, hindi, tamil, telugu, kannada, etc.
- **custom:is_admin**: "true" or "false"

## User Status Values

- **CONFIRMED**: Email verified, can login
- **UNCONFIRMED**: Registered but email not verified
- **ARCHIVED**: Disabled/deleted user
- **COMPROMISED**: Account flagged for security
- **UNKNOWN**: Status unclear
- **RESET_REQUIRED**: Must reset password
- **FORCE_CHANGE_PASSWORD**: Temporary password, must change

## Viewing User Activity

### Sign-in History
1. Go to Cognito User Pool
2. Click on a user
3. Scroll to "Sign-in history" section
4. See recent login attempts

### CloudWatch Logs
1. Go to CloudWatch
2. Click "Log groups"
3. Find: `/aws/lambda/sahayak-ai-backend-prod-login`
4. View login attempts and errors

## Admin User Identification

To find admin users:

1. **Check Groups**:
   - Go to Cognito User Pool
   - Click "Groups" tab
   - Click "Admins" group
   - See all admin users

2. **Check Custom Attribute**:
   - View user details
   - Look for `custom:is_admin = true`

3. **Check Email**:
   - Admin email: `admin@ezbillify.com`

## Exporting User Data

### Export All Users (CSV)
```bash
# Using AWS CLI
aws cognito-idp list-users \
  --user-pool-id <YOUR_USER_POOL_ID> \
  --region ap-south-1 \
  --output json > users.json

# Convert to CSV using jq
cat users.json | jq -r '.Users[] | [.Username, .Attributes[] | select(.Name=="email") | .Value, .UserStatus, .UserCreateDate] | @csv' > users.csv
```

### Export from Console
1. Go to Cognito User Pool
2. Click "Users" tab
3. Use browser extension or copy-paste to Excel

## User Management Actions

### Disable a User
1. Go to user details
2. Click "Disable user" button
3. User cannot login until re-enabled

### Delete a User
1. Go to user details
2. Click "Delete user" button
3. **Warning**: This is permanent!

### Reset User Password
1. Go to user details
2. Click "Reset password"
3. User receives email with reset code

### Verify User Email Manually
1. Go to user details
2. Click "Confirm user"
3. Marks email as verified

## Monitoring User Metrics

### Total Users
- Go to Cognito User Pool
- Dashboard shows total users

### Active Users
- Users with status = CONFIRMED

### New Registrations
- Filter by UserCreateDate
- Use CloudWatch metrics

### Failed Login Attempts
- Check CloudWatch logs
- Look for "NotAuthorizedException" errors

## Security Best Practices

1. **Regular Audits**:
   - Review user list monthly
   - Remove inactive users
   - Check for suspicious accounts

2. **Monitor Admin Access**:
   - Regularly check Admin group members
   - Ensure only authorized users are admins

3. **Enable MFA**:
   - Require MFA for admin users
   - Optional for regular users

4. **Set Password Policies**:
   - Already configured in Cognito
   - Minimum 8 characters
   - Requires uppercase, lowercase, numbers

5. **Monitor Failed Logins**:
   - Set up CloudWatch alarms
   - Alert on multiple failed attempts

## Troubleshooting

### User Not Showing Up
- Check if registration completed
- Verify email confirmation
- Check CloudWatch logs for errors

### Cannot Find User Pool
- Ensure you're in correct region (ap-south-1)
- Check CloudFormation stack exists
- Verify deployment was successful

### User Status Issues
- UNCONFIRMED: User needs to verify email
- RESET_REQUIRED: User must reset password
- ARCHIVED: User was deleted

## Quick Reference

**User Pool Name**: `sahayak-ai-users-prod`
**Region**: `ap-south-1` (Mumbai/Hyderabad)
**Admin Group**: `Admins`
**Admin Email**: `admin@ezbillify.com`

**Console Links**:
- Cognito: https://ap-south-1.console.aws.amazon.com/cognito/v2/idp/user-pools
- DynamoDB: https://ap-south-1.console.aws.amazon.com/dynamodbv2/home
- CloudWatch: https://ap-south-1.console.aws.amazon.com/cloudwatch/home
- Lambda: https://ap-south-1.console.aws.amazon.com/lambda/home
