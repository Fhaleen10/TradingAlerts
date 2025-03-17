// This is a placeholder email service
// In production, you would use a real email service like SendGrid, AWS SES, etc.

const sgMail = require('@sendgrid/mail');
const nodemailer = require('nodemailer');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendEmail(to, { template, data }) {
    console.log(`Sending ${template} email to ${to}`);
    console.log('Email data:', data);
    
    const msg = {
        to,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: 'TradingAlerts'
        },
        templateId: process.env.SENDGRID_TEMPLATE_ID,
        dynamicTemplateData: {
            ...data,
            subject: `TradingAlerts - ${template.charAt(0).toUpperCase() + template.slice(1).replace(/-/g, ' ')}`
        }
    };

    try {
        await sgMail.send(msg);
        console.log(`Email sent successfully to ${to}`);
    } catch (error) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error('SendGrid Error Details:', error.response.body);
        }
        throw new Error('Failed to send email');
    }
}

async function sendPasswordResetEmail(to, resetToken) {
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log(`Sending password reset email to ${to}`);
    console.log('Reset URL:', resetUrl);
    
    return sendEmail(to, {
        template: 'password-reset',
        data: {
            resetUrl,
            email: to,
            appName: 'TradingAlerts',
            supportEmail: process.env.SENDGRID_FROM_EMAIL
        }
    });
}

const sendTestEmail = async (email) => {
  const mailOptions = {
    from: process.env.SMTP_FROM,
    to: email,
    subject: 'TradingView Alerts Test',
    html: `
      <h1>🎉 Your TradingView Alerts Email is Working!</h1>
      <p>This is a test email to confirm that your notification settings are working correctly.</p>
      <p>You will receive alerts at this email address when your TradingView alerts are triggered.</p>
    `
  };

  await transporter.sendMail(mailOptions);
};

module.exports = {
    sendEmail,
    sendPasswordResetEmail,
    sendTestEmail
};
