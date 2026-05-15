import nodemailer from 'nodemailer';

/**
 * Email transporter using Gmail SMTP.
 *
 * Required env vars:
 *   SMTP_EMAIL     — Your Gmail address (e.g. nutriguide.app@gmail.com)
 *   SMTP_PASSWORD  — Gmail App Password (16-char code from Google Account → Security → App passwords)
 */
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.SMTP_EMAIL,
    pass: process.env.SMTP_PASSWORD,
  },
});

/**
 * Send a password reset OTP to the user's email.
 */
export async function sendOtpEmail(to: string, otp: string): Promise<void> {
  const mailOptions = {
    from: `"Nutri-Guide" <${process.env.SMTP_EMAIL}>`,
    to,
    subject: 'Your Password Reset OTP — Nutri-Guide',
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background: #f8fafc; border-radius: 16px;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #1e3a5f; font-size: 24px; margin: 0;">🔐 Password Reset</h1>
          <p style="color: #64748b; font-size: 14px; margin-top: 8px;">Nutri-Guide</p>
        </div>
        
        <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #e2e8f0;">
          <p style="color: #334155; font-size: 15px; margin: 0 0 16px 0;">
            Hi there! We received a request to reset your password. Use the OTP below to proceed:
          </p>
          
          <div style="text-align: center; margin: 24px 0;">
            <div style="display: inline-block; background: #1e3a5f; color: #ffffff; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px 32px; border-radius: 12px;">
              ${otp}
            </div>
          </div>
          
          <p style="color: #64748b; font-size: 13px; margin: 16px 0 0 0; text-align: center;">
            This OTP is valid for <strong>15 minutes</strong>. Do not share it with anyone.
          </p>
        </div>
        
        <p style="color: #94a3b8; font-size: 12px; text-align: center; margin-top: 24px;">
          If you didn't request a password reset, you can safely ignore this email.
        </p>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
}
