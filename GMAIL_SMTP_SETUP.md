# Gmail SMTP Setup Guide for Custom Emails

## Overview

We've set up a custom email service using Gmail SMTP to send:
- Registration verification emails
- Password reset emails
- Beautiful HTML email templates

## Step 1: Enable 2-Factor Authentication on Gmail

1. Go to: https://myaccount.google.com/security
2. Scroll to "How you sign in to Google"
3. Click "2-Step Verification"
4. Follow the steps to enable 2FA (required for App Passwords)

## Step 2: Generate Gmail App Password

1. Go to: https://myaccount.google.com/apppasswords
   - Or: Google Account → Security → 2-Step Verification → App passwords

2. **Select app**: Choose "Mail"

3. **Select device**: Choose "Other (Custom name)"
   - Enter: "Sahayak AI Backend"

4. Click "Generate"

5. **Copy the 16-character password** (format: xxxx xxxx xxxx xxxx)
   - Save this securely - you won't see it again!

## Step 3: Set Environment Variables

### For Local Development

Create a `.env` file in the `backend` folder:

```bash
cd backend
cat > .env << 'EOF'
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=your-16-char-app-password
EOF
```

Replace:
- `your-email@gmail.com` with your Gmail address
- `your-16-char-app-password` with the app password from Step 2

### For AWS Deployment

Set environment variables before deploying:

```bash
export SMTP_EMAIL=your-email@gmail.com
export SMTP_PASSWORD=your-16-char-app-password

cd backend
npx serverless deploy --stage prod --region ap-south-1
```

**Or** add to your shell profile (~/.bashrc or ~/.zshrc):

```bash
echo 'export SMTP_EMAIL=your-email@gmail.com' >> ~/.zshrc
echo 'export SMTP_PASSWORD=your-16-char-app-password' >> ~/.zshrc
source ~/.zshrc
```

## Step 4: Install Dependencies

```bash
cd backend
npm install
```

This will install:
- `nodemailer` - Email sending library
- `@aws-sdk/client-lambda` - For invoking email function
- `@aws-sdk/client-cognito-identity-provider` - For Cognito integration

## Step 5: Deploy to AWS

```bash
cd backend
npx serverless deploy --stage prod --region ap-south-1
```

## Step 6: Test Email Sending

### Test Registration Email

```bash
curl -X POST https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User",
    "userType": "individual",
    "language": "english"
  }'
```

### Test Forgot Password Email

```bash
curl -X POST https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Test Direct Email Sending

```bash
curl -X POST https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod/email/send \
  -H "Content-Type: application/json" \
  -d '{
    "to": "recipient@example.com",
    "subject": "Test Email",
    "text": "This is a test email from Sahayak AI",
    "html": "<h1>Test Email</h1><p>This is a test email from Sahayak AI</p>"
  }'
```

## Email Templates

### Verification Email
- **Subject**: "Verify your Sahayak AI account"
- **Design**: Blue theme with verification code
- **Includes**: User name, 6-digit code, expiry time

### Password Reset Email
- **Subject**: "Reset your Sahayak AI password"
- **Design**: Red theme with security warning
- **Includes**: User name, reset code, security notice

## Troubleshooting

### Error: "Invalid login: 535-5.7.8 Username and Password not accepted"

**Solution**: 
1. Ensure 2FA is enabled on Gmail
2. Use App Password, not regular password
3. Remove spaces from app password (should be 16 characters)

### Error: "Connection timeout"

**Solution**:
1. Check if Gmail SMTP is blocked by firewall
2. Try port 465 (SSL) instead of 587 (TLS)
3. Ensure Lambda has internet access (check VPC settings)

### Error: "Daily sending quota exceeded"

**Solution**:
- Gmail free accounts: 500 emails/day
- Google Workspace: 2,000 emails/day
- Consider upgrading or using AWS SES for production

### Emails going to spam

**Solution**:
1. Add SPF record to your domain:
   ```
   v=spf1 include:_spf.google.com ~all
   ```

2. Set up DKIM (if using custom domain)

3. Warm up the email account (start with low volume)

4. Ask recipients to whitelist your email

## Gmail Limits

| Account Type | Daily Limit | Per Message |
|--------------|-------------|-------------|
| Free Gmail | 500 emails/day | 500 recipients |
| Google Workspace | 2,000 emails/day | 2,000 recipients |

## Security Best Practices

1. **Never commit credentials**:
   - Add `.env` to `.gitignore`
   - Use environment variables only

2. **Rotate app passwords**:
   - Change every 90 days
   - Revoke unused passwords

3. **Monitor usage**:
   - Check Gmail sent folder
   - Set up alerts for unusual activity

4. **Use dedicated email**:
   - Create separate Gmail for app emails
   - Don't use personal email

## Alternative: AWS SES (Production Recommended)

For production, consider AWS SES:
- **Cost**: $0.10 per 1,000 emails
- **Limit**: Starts at 200/day, increases with reputation
- **Deliverability**: Better than Gmail
- **Setup**: See `EMAIL_SETUP_GUIDE.md`

## Monitoring

### Check Email Logs

```bash
# View Lambda logs
aws logs tail /aws/lambda/sahayak-ai-backend-prod-sendEmail --follow

# Check for errors
aws logs filter-pattern /aws/lambda/sahayak-ai-backend-prod-sendEmail "ERROR"
```

### Email Metrics

Track in CloudWatch:
- Emails sent
- Failures
- Response times

## Quick Reference

**SMTP Server**: smtp.gmail.com
**Port**: 587 (TLS) or 465 (SSL)
**Authentication**: App Password (16 characters)
**Daily Limit**: 500 emails (free) / 2,000 (workspace)

**Environment Variables**:
```bash
SMTP_EMAIL=your-email@gmail.com
SMTP_PASSWORD=xxxx-xxxx-xxxx-xxxx
```

**Lambda Function**: `sahayak-ai-backend-prod-sendEmail`
**API Endpoint**: `POST /email/send`

## Next Steps

1. ✅ Enable 2FA on Gmail
2. ✅ Generate App Password
3. ✅ Set environment variables
4. ✅ Deploy to AWS
5. ✅ Test email sending
6. ✅ Monitor logs

## Support

If emails still not working:
1. Check CloudWatch logs for errors
2. Verify environment variables are set
3. Test with curl command
4. Check Gmail account for blocks
5. Review AWS Lambda execution role permissions
