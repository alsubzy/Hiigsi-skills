import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
    },
});

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export async function sendEmail({ to, subject, html }: EmailOptions) {
    try {
        await transporter.sendMail({
            from: process.env.FROM_EMAIL || 'noreply@hiigsi.com',
            to,
            subject,
            html,
        });
        return { success: true };
    } catch (error) {
        console.error('Email sending failed:', error);
        return { success: false, error };
    }
}

export async function sendPasswordResetEmail(email: string, resetToken: string) {
    const resetUrl = `${process.env.APP_URL}/reset-password?token=${resetToken}`;

    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Hello,</p>
          <p>We received a request to reset your password for your Hiigsi School Management System account.</p>
          <p>Click the button below to reset your password. This link will expire in 1 hour.</p>
          <p style="text-align: center;">
            <a href="${resetUrl}" class="button">Reset Password</a>
          </p>
          <p>If you didn't request this, you can safely ignore this email.</p>
          <p>For security reasons, this link will expire in 1 hour.</p>
        </div>
        <div class="footer">
          <p>© 2025 Hiigsi School Management System. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Password Reset Request - Hiigsi SMS',
        html,
    });
}

export async function sendWelcomeEmail(email: string, firstName: string) {
    const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
        .button { display: inline-block; padding: 12px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to Hiigsi!</h1>
        </div>
        <div class="content">
          <p>Hello ${firstName},</p>
          <p>Your account has been created successfully by the administrator.</p>
          <p>You can now log in to access the School Management System.</p>
          <p style="text-align: center;">
            <a href="${process.env.APP_URL}/sign-in" class="button">Go to Login</a>
          </p>
          <p>If you have any questions, please contact your system administrator.</p>
        </div>
      </div>
    </body>
    </html>
  `;

    return sendEmail({
        to: email,
        subject: 'Welcome to Hiigsi School Management System',
        html,
    });
}
