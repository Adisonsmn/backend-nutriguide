import prisma from '../models/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateId } from '../utils/idGenerator.js';
import { sendOtpEmail } from '../utils/email.js';
import { notificationService } from './notification.service.js';

const SALT_ROUNDS = 10;

// In-memory refresh token store (use Redis in production)
const refreshTokens = new Set<string>();

export const authService = {
  async register(name: string, email: string, password: string) {
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      throw Object.assign(new Error('Email already registered'), { statusCode: 409 });
    }

    const password_hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user_id = await generateId('USER', 'users', 'user_id');

    const user = await prisma.user.create({
      data: { user_id, name, email, password_hash },
      select: {
        user_id: true,
        name: true,
        email: true,
        is_active: true,
        created_at: true,
        updated_at: true,
      },
    });

    return user;
  },

  async login(email: string, password: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Email not registered'), { statusCode: 401 });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    if (!isPasswordValid) {
      throw Object.assign(new Error('Incorrect password'), { statusCode: 401 });
    }

    const payload = { userId: user.user_id, email: user.email };

    const accessToken = jwt.sign(payload, process.env.JWT_SECRET as string, {
      expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || '15m') as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);

    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET as string, {
      expiresIn: (process.env.REFRESH_TOKEN_EXPIRE || '7d') as jwt.SignOptions['expiresIn'],
    } as jwt.SignOptions);

    refreshTokens.add(refreshToken);

    const { password_hash, ...userData } = user;

    // Fire-and-forget notification
    notificationService.createNotification(
      user.user_id, 'login', `Welcome back, ${user.name}!`
    ).catch(() => {});

    return { accessToken, refreshToken, user: userData };
  },

  async logout(refreshToken: string) {
    refreshTokens.delete(refreshToken);
  },

  async refreshAccessToken(refreshToken: string) {
    if (!refreshTokens.has(refreshToken)) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }

    try {
      const decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string; email: string };

      const accessToken = jwt.sign(
        { userId: decoded.userId, email: decoded.email },
        process.env.JWT_SECRET as string,
        { expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || '15m') as jwt.SignOptions['expiresIn'] } as jwt.SignOptions
      );

      return { accessToken };
    } catch {
      refreshTokens.delete(refreshToken);
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
    }
  },

  async forgotPassword(email: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Email not found'), { statusCode: 404 });
    }

    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes from now

    await prisma.user.update({
      where: { email },
      data: {
        reset_otp: otp,
        reset_otp_expires: expires,
      },
    });

    // Send OTP via email
    try {
      await sendOtpEmail(email, otp);
      return { message: 'OTP has been sent to your email address.' };
    } catch (emailError) {
      console.error('[ForgotPassword] Failed to send email:', emailError);
      // Fallback: still return OTP for development/testing
      return { otp, message: 'Email sending failed. OTP returned for development.' };
    }
  },

  async resetPassword(email: string, otp: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw Object.assign(new Error('Email not found'), { statusCode: 404 });
    }

    if (!user.reset_otp || user.reset_otp !== otp) {
      throw Object.assign(new Error('Invalid OTP'), { statusCode: 400 });
    }

    if (!user.reset_otp_expires || user.reset_otp_expires < new Date()) {
      throw Object.assign(new Error('OTP has expired'), { statusCode: 400 });
    }

    // Validate new password is different from old password
    const isSamePassword = await bcrypt.compare(newPassword, user.password_hash);
    if (isSamePassword) {
      throw Object.assign(
        new Error('New password must be different from your current password'),
        { statusCode: 400 }
      );
    }

    const password_hash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    await prisma.user.update({
      where: { email },
      data: {
        password_hash,
        reset_otp: null,
        reset_otp_expires: null,
      },
    });

    // Fire-and-forget notification
    notificationService.createNotification(
      user.user_id, 'password', 'Your password has been changed successfully'
    ).catch(() => {});

    return { message: 'Password reset successfully' };
  },
};
