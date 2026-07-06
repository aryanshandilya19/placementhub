import { Resend } from 'resend';
import { logger } from '../utils/logger.js';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (toEmail, name, verificationLink) => {
  try {
    await resend.emails.send({
      from: 'PlacementHub <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Verify your PlacementHub account',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Welcome to PlacementHub, ${name}!</h2>
          <p>Click the button below to verify your email address.</p>
          <a href="${verificationLink}" style="display:inline-block;padding:12px 24px;background:#4f46e5;color:#fff;text-decoration:none;border-radius:6px;">Verify Email</a>
          <p>This link expires in 24 hours.</p>
          <p>If you didn't create this account, ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    logger.error('Failed to send verification email:', error);
    throw error;
  }
};

export const sendPasswordResetEmail = async (toEmail, name, resetLink) => {
  try {
    await resend.emails.send({
      from: 'PlacementHub <onboarding@resend.dev>',
      to: toEmail,
      subject: 'Reset your PlacementHub password',
      html: `
        <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
          <h2>Hi ${name},</h2>
          <p>We received a request to reset your password.</p>
          <a href="${resetLink}" style="display:inline-block;padding:12px 24px;background:#dc2626;color:#fff;text-decoration:none;border-radius:6px;">Reset Password</a>
          <p>This link expires in 1 hour.</p>
          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });
  } catch (error) {
    logger.error('Failed to send password reset email:', error);
    throw error;
  }
};