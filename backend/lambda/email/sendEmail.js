const nodemailer = require('nodemailer');

// Create transporter with Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASSWORD // App password, not regular password
    }
  });
};

exports.handler = async (event) => {
  try {
    const { to, subject, html, text } = JSON.parse(event.body || event);

    if (!to || !subject || (!html && !text)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing required fields' })
      };
    }

    const transporter = createTransporter();

    const mailOptions = {
      from: `"Sahayak AI" <${process.env.SMTP_EMAIL}>`,
      to,
      subject,
      text,
      html
    };

    const info = await transporter.sendMail(mailOptions);

    console.log('Email sent:', info.messageId);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        messageId: info.messageId
      })
    };

  } catch (error) {
    console.error('Error sending email:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ 
        error: 'Failed to send email',
        details: error.message 
      })
    };
  }
};

// Email templates
exports.getVerificationEmailTemplate = (code, name) => {
  return {
    subject: 'Verify your Sahayak AI account',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #2563eb; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px solid #2563eb; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Sahayak AI</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'},</h2>
            <p>Welcome to Sahayak AI! Please verify your email address by entering this code:</p>
            <div class="code">${code}</div>
            <p>This code expires in 24 hours.</p>
            <p>If you didn't create an account, please ignore this email.</p>
            <p>Best regards,<br>Sahayak AI Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Sahayak AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${name || 'there'},\n\nWelcome to Sahayak AI! Your verification code is: ${code}\n\nThis code expires in 24 hours.\n\nBest regards,\nSahayak AI Team`
  };
};

exports.getPasswordResetEmailTemplate = (code, name) => {
  return {
    subject: 'Reset your Sahayak AI password',
    html: `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #dc2626; color: white; padding: 20px; text-align: center; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
          .code { background: white; border: 2px solid #dc2626; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px; }
          .warning { background: #fef2f2; border-left: 4px solid #dc2626; padding: 15px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Password Reset</h1>
          </div>
          <div class="content">
            <h2>Hi ${name || 'there'},</h2>
            <p>We received a request to reset your password. Enter this code to reset:</p>
            <div class="code">${code}</div>
            <p>This code expires in 1 hour.</p>
            <div class="warning">
              <strong>⚠️ Security Notice:</strong> If you didn't request this password reset, please ignore this email and ensure your account is secure.
            </div>
            <p>Best regards,<br>Sahayak AI Team</p>
          </div>
          <div class="footer">
            <p>© 2024 Sahayak AI. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
    text: `Hi ${name || 'there'},\n\nWe received a request to reset your password. Your reset code is: ${code}\n\nThis code expires in 1 hour.\n\nIf you didn't request this, please ignore this email.\n\nBest regards,\nSahayak AI Team`
  };
};
