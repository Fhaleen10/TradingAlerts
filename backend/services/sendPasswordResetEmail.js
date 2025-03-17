const sgMail = require('@sendgrid/mail');
require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendPasswordResetEmail(to, resetToken) {
    console.log('SendGrid Configuration:');
    console.log('From Email:', process.env.SENDGRID_FROM_EMAIL);
    console.log('API Key exists:', !!process.env.SENDGRID_API_KEY);
    
    console.log(`Sending password reset email to ${to}`);
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${resetToken}`;
    console.log('Reset URL:', resetUrl);
    
    const msg = {
        to,
        from: {
            email: process.env.SENDGRID_FROM_EMAIL,
            name: 'TradingAlerts'
        },
        subject: 'Reset Your Password - TradingAlerts',
        html: `
            <h1>Reset Your Password</h1>
            <p>You requested to reset your password. Click the link below to set a new password:</p>
            <a href="${resetUrl}" style="display: inline-block; background-color: #4CAF50; color: white; padding: 14px 25px; text-align: center; text-decoration: none; font-size: 16px; margin: 4px 2px; cursor: pointer; border-radius: 4px;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you did not request this, please ignore this email.</p>
            <p>Best regards,<br>TradingAlerts Team</p>
        `
    };

    try {
        console.log('Attempting to send email with SendGrid...');
        const response = await sgMail.send(msg);
        console.log('SendGrid Response:', response);
        console.log(`Reset email sent successfully to ${to}`);
    } catch (error) {
        console.error('SendGrid Error:', error);
        if (error.response) {
            console.error('SendGrid Error Details:', error.response.body);
            console.error('SendGrid Error Status:', error.code);
            console.error('SendGrid Error Headers:', error.response.headers);
        }
        throw error;
    }
}

module.exports = sendPasswordResetEmail;
