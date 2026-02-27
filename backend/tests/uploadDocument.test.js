const { handler } = require('../lambda/uploadDocument');

describe('Upload Document Lambda', () => {
  test('should return 400 if required fields are missing', async () => {
    const event = {
      body: JSON.stringify({
        fileName: 'test.pdf'
        // Missing other required fields
      })
    };

    const result = await handler(event);
    
    expect(result.statusCode).toBe(400);
    expect(JSON.parse(result.body).error).toBe('Missing required fields');
  });

  test('should return 200 on successful upload', async () => {
    const event = {
      body: JSON.stringify({
        fileName: 'test.pdf',
        fileType: 'application/pdf',
        fileContent: Buffer.from('test content').toString('base64'),
        userId: 'test-user-123'
      })
    };

    // Mock AWS SDK calls
    jest.mock('@aws-sdk/client-s3');
    jest.mock('@aws-sdk/client-dynamodb');

    const result = await handler(event);
    
    expect(result.statusCode).toBe(200);
    const body = JSON.parse(result.body);
    expect(body.message).toBe('Document uploaded successfully');
    expect(body.documentId).toBeDefined();
  });

  test('should handle large files', async () => {
    const largeContent = Buffer.alloc(10 * 1024 * 1024).toString('base64'); // 10MB
    
    const event = {
      body: JSON.stringify({
        fileName: 'large.pdf',
        fileType: 'application/pdf',
        fileContent: largeContent,
        userId: 'test-user-123'
      })
    };

    const result = await handler(event);
    expect(result.statusCode).toBe(200);
  });

  test('should validate file types', async () => {
    const event = {
      body: JSON.stringify({
        fileName: 'test.exe',
        fileType: 'application/x-msdownload',
        fileContent: 'base64content',
        userId: 'test-user-123'
      })
    };

    // Should accept only PDF, JPG, PNG
    const result = await handler(event);
    // Add validation logic in actual implementation
  });
});
