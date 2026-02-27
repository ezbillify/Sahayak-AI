const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { v4: uuidv4 } = require('uuid');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const { userId, type, title, description, dueDate, priority } = JSON.parse(event.body);

    const complianceId = uuidv4();
    const compliance = {
      complianceId,
      userId,
      type, // GST, PAN, License, Tax, etc.
      title,
      description,
      dueDate,
      priority: priority || 'medium',
      status: 'pending',
      reminders: [],
      createdAt: new Date().toISOString()
    };

    await docClient.send(new PutCommand({
      TableName: process.env.COMPLIANCE_TABLE,
      Item: compliance
    }));

    // Schedule reminders (30, 7, 1 days before)
    const due = new Date(dueDate);
    const reminders = [30, 7, 1].map(days => {
      const reminderDate = new Date(due);
      reminderDate.setDate(reminderDate.getDate() - days);
      return {
        reminderId: uuidv4(),
        scheduledDate: reminderDate.toISOString(),
        sent: false
      };
    });

    compliance.reminders = reminders;

    return {
      statusCode: 201,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ complianceId, message: 'Compliance added successfully' })
    };
  } catch (error) {
    console.error('Error adding compliance:', error);
    return {
      statusCode: 500,
      headers: { 'Access-Control-Allow-Origin': '*' },
      body: JSON.stringify({ error: 'Failed to add compliance' })
    };
  }
};
