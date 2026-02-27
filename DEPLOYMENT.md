# 🚀 Sahayak AI - Complete Deployment Guide

## Prerequisites

### Required Tools
- Node.js 20+
- AWS CLI configured
- AWS Account with credits
- Git
- Android Studio (for mobile Android)
- Xcode (for mobile iOS, Mac only)

### AWS Services Required
- Lambda
- S3
- DynamoDB
- API Gateway
- Textract
- Bedrock (Claude 3.5 Sonnet access)
- SNS
- SES
- EventBridge
- Cognito
- CloudWatch
- WAF

---

## Part 1: Backend Deployment

### Step 1: Configure AWS Credentials
```bash
aws configure
# Enter your AWS Access Key ID
# Enter your AWS Secret Access Key
# Region: ap-south-1 (Mumbai)
# Output format: json
```

### Step 2: Install Serverless Framework
```bash
npm install -g serverless
```

### Step 3: Deploy Backend
```bash
cd backend
npm install
serverless deploy --stage prod
```

This will create:
- 8 Lambda functions
- S3 bucket with encryption
- 4 DynamoDB tables
- API Gateway endpoints
- IAM roles and policies

### Step 4: Note API Gateway URL
After deployment, save the API Gateway URL:
```
https://xxxxxxxxxx.execute-api.ap-south-1.amazonaws.com/prod
```

### Step 5: Enable Bedrock Models
1. Go to AWS Bedrock console
2. Request access to:
   - Claude 3.5 Sonnet
   - Claude 3 Haiku
   - Titan Embeddings
3. Wait for approval (usually instant)

### Step 6: Configure SNS for Notifications
```bash
aws sns create-topic --name sahayak-ai-notifications
aws sns subscribe --topic-arn <TOPIC_ARN> --protocol email --notification-endpoint your@email.com
```

---

## Part 2: Frontend Deployment

### Option A: Deploy to Vercel (Recommended)

```bash
cd frontend
npm install
npm run build

# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

### Option B: Deploy to Netlify

```bash
cd frontend
npm install
npm run build

# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod --dir=dist
```

### Option C: Deploy to AWS S3 + CloudFront

```bash
cd frontend
npm install
npm run build

# Create S3 bucket
aws s3 mb s3://sahayak-ai-frontend

# Upload build
aws s3 sync dist/ s3://sahayak-ai-frontend --acl public-read

# Create CloudFront distribution (via console or CLI)
```

### Step 7: Update Environment Variables

Create `frontend/.env.production`:
```
VITE_API_URL=https://your-api-gateway-url.amazonaws.com/prod
VITE_AWS_REGION=ap-south-1
```

---

## Part 3: Mobile App Deployment

### Android Deployment

#### Step 1: Setup Android Environment
```bash
cd mobile
npm install

# Generate Android bundle
cd android
./gradlew bundleRelease
```

#### Step 2: Sign the APK
```bash
keytool -genkey -v -keystore sahayak-ai.keystore -alias sahayak -keyalg RSA -keysize 2048 -validity 10000
```

Add to `android/gradle.properties`:
```
MYAPP_RELEASE_STORE_FILE=sahayak-ai.keystore
MYAPP_RELEASE_KEY_ALIAS=sahayak
MYAPP_RELEASE_STORE_PASSWORD=your_password
MYAPP_RELEASE_KEY_PASSWORD=your_password
```

#### Step 3: Build Release APK
```bash
cd android
./gradlew assembleRelease
```

APK location: `android/app/build/outputs/apk/release/app-release.apk`

#### Step 4: Upload to Google Play Store
1. Create Google Play Developer account ($25 one-time fee)
2. Create new app in Play Console
3. Upload APK/AAB
4. Fill in store listing details
5. Submit for review

### iOS Deployment (Mac only)

#### Step 1: Setup iOS Environment
```bash
cd mobile/ios
pod install
```

#### Step 2: Open in Xcode
```bash
open SahayakAIMobile.xcworkspace
```

#### Step 3: Configure Signing
1. Select project in Xcode
2. Go to Signing & Capabilities
3. Select your Apple Developer team
4. Enable automatic signing

#### Step 4: Archive and Upload
1. Product → Archive
2. Distribute App → App Store Connect
3. Upload

#### Step 5: Submit to App Store
1. Go to App Store Connect
2. Create new app
3. Fill in metadata
4. Submit for review

---

## Part 4: CI/CD Setup

### GitHub Actions (Already configured)

1. Add secrets to GitHub repository:
   - `AWS_ACCESS_KEY_ID`
   - `AWS_SECRET_ACCESS_KEY`
   - `VERCEL_TOKEN`
   - `VERCEL_ORG_ID`
   - `VERCEL_PROJECT_ID`

2. Push to main branch triggers automatic deployment

---

## Part 5: Security Configuration

### Enable WAF
```bash
aws wafv2 create-web-acl \
  --name sahayak-ai-waf \
  --scope REGIONAL \
  --region ap-south-1 \
  --default-action Allow={} \
  --rules file://backend/config/security.yml
```

### Enable CloudWatch Alarms
```bash
aws cloudwatch put-metric-alarm \
  --alarm-name sahayak-high-error-rate \
  --alarm-description "Alert on high error rate" \
  --metric-name Errors \
  --namespace AWS/Lambda \
  --statistic Sum \
  --period 300 \
  --threshold 10 \
  --comparison-operator GreaterThanThreshold
```

### Enable S3 Encryption
```bash
aws s3api put-bucket-encryption \
  --bucket sahayak-ai-documents-prod \
  --server-side-encryption-configuration '{
    "Rules": [{
      "ApplyServerSideEncryptionByDefault": {
        "SSEAlgorithm": "AES256"
      }
    }]
  }'
```

---

## Part 6: Monitoring Setup

### CloudWatch Dashboard
```bash
aws cloudwatch put-dashboard \
  --dashboard-name sahayak-ai-dashboard \
  --dashboard-body file://monitoring/dashboard.json
```

### Log Aggregation
- All Lambda logs go to CloudWatch Logs
- Set retention to 90 days
- Create log insights queries for debugging

---

## Part 7: Testing in Production

### Smoke Tests
```bash
# Test document upload
curl -X POST https://your-api.com/documents/upload \
  -H "Content-Type: application/json" \
  -d '{
    "userId": "test-user",
    "fileName": "test.pdf",
    "fileType": "application/pdf",
    "fileContent": "base64content"
  }'

# Test document analysis
curl https://your-api.com/documents/{documentId}/analyze?language=english
```

### Load Testing
```bash
# Install artillery
npm install -g artillery

# Run load test
artillery quick --count 100 --num 10 https://your-api.com/documents/upload
```

---

## Part 8: Post-Deployment Checklist

- [ ] Backend deployed and accessible
- [ ] Frontend deployed and accessible
- [ ] Mobile apps submitted to stores
- [ ] All environment variables configured
- [ ] WAF rules enabled
- [ ] CloudWatch alarms configured
- [ ] S3 encryption enabled
- [ ] DynamoDB encryption enabled
- [ ] Backup policies configured
- [ ] Monitoring dashboard created
- [ ] Error tracking setup (Sentry)
- [ ] Analytics setup (Google Analytics)
- [ ] Domain configured (if custom domain)
- [ ] SSL certificate configured
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Documentation updated
- [ ] Team trained on monitoring

---

## Cost Estimation (Monthly)

### AWS Services
- Lambda: $10-50 (based on usage)
- S3: $5-20 (storage + requests)
- DynamoDB: $5-25 (on-demand pricing)
- API Gateway: $3-15 (per million requests)
- Textract: $15-100 (per 1000 pages)
- Bedrock: $50-500 (based on tokens)
- SNS/SES: $1-10 (notifications)
- CloudWatch: $5-15 (logs + metrics)

**Total: $94-735/month** (scales with usage)

### Other Services
- Vercel: Free (Hobby) or $20/month (Pro)
- Domain: $10-15/year
- Google Play: $25 one-time
- Apple Developer: $99/year

---

## Scaling Considerations

### Auto-Scaling (Already configured)
- Lambda: Automatic (up to 1000 concurrent)
- DynamoDB: On-demand (auto-scales)
- API Gateway: Handles millions of requests

### Performance Optimization
- Enable CloudFront CDN for frontend
- Use Lambda provisioned concurrency for critical functions
- Implement caching with ElastiCache (if needed)
- Use DynamoDB DAX for read-heavy workloads

---

## Backup & Disaster Recovery

### Automated Backups
```bash
# Enable DynamoDB point-in-time recovery
aws dynamodb update-continuous-backups \
  --table-name sahayak-ai-documents-prod \
  --point-in-time-recovery-specification PointInTimeRecoveryEnabled=true

# Enable S3 versioning
aws s3api put-bucket-versioning \
  --bucket sahayak-ai-documents-prod \
  --versioning-configuration Status=Enabled
```

### Disaster Recovery Plan
1. Database: Point-in-time recovery (35 days)
2. Documents: S3 versioning + Glacier backup
3. Code: Git repository
4. Infrastructure: Serverless.yml (Infrastructure as Code)

---

## Support & Maintenance

### Monitoring
- Check CloudWatch dashboard daily
- Review error logs weekly
- Analyze cost reports monthly

### Updates
- Update dependencies monthly
- Security patches immediately
- Feature releases bi-weekly

### User Support
- Monitor user feedback
- Track error rates
- Respond to issues within 24 hours

---

## 🎉 Deployment Complete!

Your Sahayak AI platform is now live and helping Indian citizens manage government paperwork!

**URLs:**
- Frontend: https://your-domain.com
- API: https://your-api.amazonaws.com/prod
- Android: Google Play Store
- iOS: Apple App Store

**Next Steps:**
1. Monitor initial user feedback
2. Iterate on features
3. Scale as needed
4. Add more government services
5. Expand to more languages
