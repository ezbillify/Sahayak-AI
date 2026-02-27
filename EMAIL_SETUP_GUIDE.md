# Email Configuration Guide

## Current Setup

✅ **Cognito Default Email is ACTIVE**
- Emails will be sent automatically
- Sender: `no-reply@verificationemail.com`
- **Limit**: 50 emails per day
- **Issue**: May go to spam folder

## How It Works Now

When users:
1. **Register** → Verification code sent to email
2. **Forgot Password** → Reset code sent to email
3. **Change Email** → Verification code sent

**Check your spam folder if you don't see the email!**

## Production Setup (Recommended)

For production use, configure Amazon SES for better deliverability:

### Step 1: Verify Your Domain in SES

1. Go to AWS Console → Amazon SES
2. Click "Verified identities"
3. Click "Create identity"
4. Choose "Domain"
5. Enter your domain (e.g., `ezbillify.com`)
6. Enable DKIM signing
7. Click "Create identity"

### Step 2: Add DNS Records

Add the provided DNS records to your domain:
- DKIM records (3 CNAME records)
- MX record (if receiving emails)
- SPF record: `v=spf1 include:amazonses.com ~all`
- DMARC record: `v=DMARC1; p=quarantine; rua=mailto:dmarc@ezbillify.com`

### Step 3: Verify Email Address

1. In SES, click "Create identity"
2. Choose "Email address"
3. Enter: `noreply@ezbillify.com`
4. Check email and click verification link

### Step 4: Request Production Access

1. In SES, click "Account dashboard"
2. Click "Request production access"
3. Fill out the form:
   - Use case: Transactional emails (authentication, password reset)
   - Expected volume: Estimate daily emails
   - Bounce/complaint handling: Describe your process
4. Submit and wait for approval (usually 24 hours)

### Step 5: Update Cognito Configuration

Update `backend/serverless.yml`:

```yaml
EmailConfiguration:
  EmailSendingAccount: DEVELOPER
  SourceArn: arn:aws:ses:ap-south-1:YOUR_ACCOUNT_ID:identity/noreply@ezbillify.com
  From: "Sahayak AI <noreply@ezbillify.com>"
  ReplyToEmailAddress: support@ezbillify.com
```

### Step 6: Redeploy

```bash
cd backend
npx serverless deploy --stage prod --region ap-south-1
```

## Email Templates

### Verification Email
```
Subject: Verify your Sahayak AI account

Hi {name},

Welcome to Sahayak AI! Please verify your email address by entering this code:

{code}

This code expires in 24 hours.

If you didn't create an account, please ignore this email.

Best regards,
Sahayak AI Team
```

### Password Reset Email
```
Subject: Reset your Sahayak AI password

Hi {name},

We received a request to reset your password. Enter this code to reset:

{code}

This code expires in 1 hour.

If you didn't request this, please ignore this email.

Best regards,
Sahayak AI Team
```

## Custom Email Templates (Optional)

To customize email templates in Cognito:

1. Go to AWS Console → Cognito → User Pools
2. Select your user pool: `sahayak-ai-users-prod`
3. Go to "Messaging" tab
4. Click "Edit" under "Email"
5. Customize:
   - Verification email subject/message
   - Password reset email subject/message
6. Use variables: `{####}` for code, `{username}` for email

## Testing Emails

### Test in Development

```bash
# Test registration email
curl -X POST https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123",
    "name": "Test User"
  }'

# Test forgot password email
curl -X POST https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com"
  }'
```

### Check Email Delivery

1. Go to AWS Console → SES → "Sending statistics"
2. Monitor:
   - Sends
   - Bounces
   - Complaints
3. Set up CloudWatch alarms for high bounce rates

## Troubleshooting

### Email not received

1. **Check spam folder** - Most common issue
2. **Verify email in SES** - Must be verified in sandbox mode
3. **Check SES sending limits** - Default 50/day with COGNITO_DEFAULT
4. **Check CloudWatch logs** - Look for email sending errors
5. **Verify DNS records** - Must be properly configured for SES

### Email goes to spam

1. **Set up SPF record** - Proves email is from authorized server
2. **Enable DKIM** - Cryptographic signature
3. **Add DMARC policy** - Tells receivers how to handle failures
4. **Use verified domain** - Don't use generic Cognito email
5. **Warm up IP** - Gradually increase sending volume

### SES in sandbox mode

In sandbox mode, you can only send to:
- Verified email addresses
- Verified domains

To send to any email:
1. Request production access (see Step 4 above)
2. Wait for approval
3. Start with low volume and increase gradually

## Monitoring

### Set up CloudWatch Alarms

```yaml
# Add to serverless.yml resources
EmailBouncesAlarm:
  Type: AWS::CloudWatch::Alarm
  Properties:
    AlarmName: sahayak-ai-email-bounces
    MetricName: Reputation.BounceRate
    Namespace: AWS/SES
    Statistic: Average
    Period: 300
    EvaluationPeriods: 1
    Threshold: 0.05
    ComparisonOperator: GreaterThanThreshold
    AlarmActions:
      - !Ref AlertTopic
```

### Email Metrics to Track

- **Delivery rate** - Should be >95%
- **Bounce rate** - Should be <5%
- **Complaint rate** - Should be <0.1%
- **Open rate** - Track engagement
- **Click rate** - For emails with links

## Cost Estimation

### Cognito Default Email
- **Cost**: Free
- **Limit**: 50 emails/day
- **Best for**: Development/testing

### Amazon SES
- **Cost**: $0.10 per 1,000 emails
- **Limit**: Starts at 200/day, increases with reputation
- **Best for**: Production

### Example Monthly Cost
- 10,000 users
- 2 emails per user (verification + occasional reset)
- 20,000 emails/month
- **Cost**: $2/month

## Security Best Practices

1. **Use HTTPS only** - Never send credentials over HTTP
2. **Rate limit auth endpoints** - Prevent abuse
3. **Monitor for suspicious activity** - Multiple failed attempts
4. **Implement CAPTCHA** - On registration/login
5. **Log all auth events** - For audit trail
6. **Rotate SES credentials** - If using SMTP
7. **Set up bounce handling** - Remove invalid emails
8. **Enable MFA for admin** - Extra security layer

## Quick Start Checklist

For immediate use (Development):
- [x] Cognito default email configured
- [x] 50 emails/day limit
- [x] Check spam folder for emails
- [ ] Test registration flow
- [ ] Test forgot password flow

For production:
- [ ] Verify domain in SES
- [ ] Add DNS records (SPF, DKIM, DMARC)
- [ ] Verify email address in SES
- [ ] Request production access
- [ ] Update Cognito to use SES
- [ ] Customize email templates
- [ ] Set up monitoring
- [ ] Test thoroughly

## Support

If emails are not working:
1. Check AWS CloudWatch logs for errors
2. Verify Cognito configuration in AWS Console
3. Check SES sending statistics
4. Review DNS records with `dig` or `nslookup`
5. Contact AWS Support if needed

## Current Status Summary

✅ **Working Now**: Cognito default email (50/day limit)
⚠️ **Action Needed**: Set up SES for production use
📧 **Check**: Spam folder if email not received
🔧 **Next Step**: Follow production setup guide above
