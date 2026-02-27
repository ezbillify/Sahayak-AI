const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, ScanCommand } = require('@aws-sdk/lib-dynamodb');
const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');

const dynamoClient = new DynamoDBClient({ region: process.env.AWS_REGION });
const docClient = DynamoDBDocumentClient.from(dynamoClient);
const snsClient = new SNSClient({ region: process.env.AWS_REGION });

exports.handler = async (event) => {
  try {
    const today = new Date().toISOString().split('T')[0];

    // Scan for compliance items with reminders due today
    const result = await docClient.send(new ScanCommand({
      TableName: process.env.COMPLIANCE_TABLE,
      FilterExpression: 'attribute_exists(reminders)'
    }));

    let sentCount = 0;

    for (const item of result.Items) {
      for (const reminder of item.reminders) {
        const reminderDate = reminder.scheduledDate.split('T')[0];
        
        if (reminderDate === today && !reminder.sent) {
          // Send notification via SNS
          await snsClient.send(new PublishCommand({
            TopicArn: process.env.NOTIFICATION_TOPIC_ARN,
            Subject: `Reminder: ${item.title}`,
            Message: `Your ${item.type} compliance "${item.title}" is due on ${item.dueDate}. Please take action.`
          }));

          reminder.sent = true;
          sentCount++;
        }
      }
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ message: `Sent ${sentCount} reminders` })
    };
  } catch (error) {
    console.error('Error sending reminders:', error);
    throw error;
  }
};
