# Sahayak AI Platform

AI-powered assistant helping Indian citizens manage government paperwork, understand official documents, fill forms correctly, and track compliance deadlines.

## 🎯 Target Users
- Students
- Freelancers  
- Small Business Owners
- General Citizens
- Senior Citizens
- Rural Users with Low Digital Literacy

## 🚀 5-Part Development Plan

### ✅ Part 1: AWS Backend Infrastructure & Document Processing (Week 1)
- AWS setup (Lambda, S3, DynamoDB, API Gateway)
- Document upload and OCR with Textract
- AI analysis with Bedrock (Claude 3.5 Sonnet)
- Core API endpoints

### 📋 Part 2: Authentication & Compliance Tracking (Week 2)
- Cognito authentication
- User profile management
- Compliance deadline tracking
- Notification system (SNS/SES)
- Multi-language support (Translate)

### 🎨 Part 3: Frontend Web Application (Week 3)
- React + TypeScript
- Clean, minimal UI (mobile-friendly)
- Document upload interface
- Form filling assistant
- Compliance dashboard

### 📱 Part 4: Mobile App & Advanced Features (Week 4)
- React Native (Android + iOS)
- Camera document scanning
- Offline mode
- Voice interface
- Push notifications

### 🔒 Part 5: Security, Testing & Deployment (Week 5)
- Security hardening
- Performance optimization
- Comprehensive testing
- CI/CD pipeline
- Production deployment

## 🛠 Technology Stack

**Backend**: AWS Lambda, API Gateway, S3, DynamoDB, Bedrock, Textract, Translate, SNS, SES, EventBridge, Cognito

**Frontend**: React, TypeScript, Tailwind CSS

**Mobile**: React Native, TypeScript

**AI Models**: Claude 3.5 Sonnet, Claude 3 Haiku, Titan Embeddings

## 📁 Project Structure

```
sahayak-ai/
├── backend/          # AWS Lambda functions and backend code
├── frontend/         # React web application
├── mobile/           # React Native mobile app
├── docs/             # Documentation
└── .kiro/specs/      # Project specifications
```

## 🎯 24-Hour Goal

Build and deploy a functional MVP that accepts government documents (PDF/image), extracts text using Textract, analyzes with Bedrock, and returns simplified explanations in English and Hindi.

## 🌐 Live Deployment

- **Frontend**: https://sahayak-ai-jet.vercel.app/
- **Backend API**: https://yy6whjwjt1.execute-api.ap-south-1.amazonaws.com/prod
- **Region**: Asia Pacific (Mumbai/Hyderabad) - ap-south-1

## 📝 License

MIT
