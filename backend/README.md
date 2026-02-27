# Sahayak AI Backend

AWS Lambda-based serverless backend for document processing and AI analysis.

## Setup

1. Install dependencies:
```bash
npm install
```

2. Configure AWS credentials:
```bash
aws configure
```

3. Deploy to AWS:
```bash
npm run deploy
```

## API Endpoints

### POST /documents/upload
Upload a document for processing
```json
{
  "userId": "user-123",
  "fileName": "gst-form.pdf",
  "fileType": "application/pdf",
  "fileContent": "base64-encoded-content"
}
```

### GET /documents/{documentId}
Get document metadata and status

### GET /documents/{documentId}/analyze?language=hindi
Analyze document with AI and get explanation

## Lambda Functions

- **uploadDocument**: Handles document uploads to S3
- **processDocument**: Triggered by S3, runs Textract OCR
- **analyzeDocument**: Uses Bedrock Claude for AI analysis
- **getDocument**: Retrieves document metadata

## AWS Resources

- S3 Bucket: Document storage with encryption
- DynamoDB Tables: Users, Documents, Compliance, Forms
- Lambda Functions: Serverless compute
- API Gateway: REST API endpoints
- Textract: OCR processing
- Bedrock: AI analysis (Claude 3.5 Sonnet)
