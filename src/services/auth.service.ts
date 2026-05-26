import prisma from '../models/prisma.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { generateId } from '../utils/idGenerator.js';
import { sendOtpEmail } from '../utils/email.js';
import { notificationService } from './notification.service.js';

const SALT_ROUNDS = 10;

/**
 * Clean up expired sessions periodically (every hour).
 * This replaces the unbounded in-memory Set (Bug #10).
 */
const startSessionCleanup = () => {
  setInterval(async () => {
    try {
      const result = await prisma.session.deleteMany({
        where: { expires_at: { lt: new Date() } },
      });
      if (result.count > 0) {
        console.log(`[SessionCleanup] Removed ${result.count} expired sessions.`);
      }
    } catch (err) {
      console.error('[SessionCleanup] Error:', err);
    }
  }, 60 * 60 * 1000); // Every hour
};

// Start cleanup on module load
startSessionCleanup();

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
    // Bug #24: Use explicit select so only needed fields are loaded
    const user = await prisma.user.findUnique({
      where: { email },
      select: {
        user_id: true,
        name: true,
        email: true,
        is_active: true,
        password_hash: true,
        created_at: true,
        updated_at: true,
      },
    });
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

    // Bug #5: Store hashed refresh token in the database instead of in-memory Set
    const tokenHash = await bcrypt.hash(refreshToken, SALT_ROUNDS);
    const sessionId = await generateId('SESS', 'sessions', 'session_id');
    await prisma.session.create({
      data: {
        session_id: sessionId,
        user_id: user.user_id,
        token_hash: tokenHash,
        expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    // Exclude password_hash from response
    const { password_hash: _, ...userData } = user;

    // Fire-and-forget notification
    notificationService.createNotification(
      user.user_id, 'login', `Welcome back, ${user.name}!`
    ).catch(() => {});

    return { accessToken, refreshToken, user: userData };
  },

  async logout(refreshToken: string, userId: string) {
    // Bug #5: Delete the session from the database
    // Find sessions for this user and check token hash
    const sessions = await prisma.session.findMany({
      where: { user_id: userId },
    });

    for (const session of sessions) {
      const isMatch = await bcrypt.compare(refreshToken, session.token_hash);
      if (isMatch) {
        await prisma.session.delete({ where: { session_id: session.session_id } });
        return;
      }
    }
    // If no matching session found, silently succeed (token may have already been cleaned up)
  },

  async refreshAccessToken(refreshToken: string) {
    // First verify the JWT itself is valid
    let decoded: { userId: string; email: string };
    try {
      decoded = jwt.verify(
        refreshToken,
        process.env.JWT_REFRESH_SECRET as string
      ) as { userId: string; email: string };
    } catch {
      throw Object.assign(new Error('Invalid or expired refresh token'), { statusCode: 401 });
    }

    // Bug #5: Check the refresh token against DB sessions
    const sessions = await prisma.session.findMany({
      where: { user_id: decoded.userId },
    });

    let matchedSession: typeof sessions[0] | null = null;
    for (const session of sessions) {
      if (session.expires_at < new Date()) continue; // Skip expired
      const isMatch = await bcrypt.compare(refreshToken, session.token_hash);
      if (isMatch) {
        matchedSession = session;
        break;
      }
    }

    if (!matchedSession) {
      throw Object.assign(new Error('Invalid refresh token'), { statusCode: 401 });
    }

    const accessToken = jwt.sign(
      { userId: decoded.userId, email: decoded.email },
      process.env.JWT_SECRET as string,
      { expiresIn: (process.env.ACCESS_TOKEN_EXPIRE || '15m') as jwt.SignOptions['expiresIn'] } as jwt.SignOptions
    );

    return { accessToken };
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
      // Bug #1 fix: NEVER return the OTP to the client
      throw Object.assign(
        new Error('Failed to send OTP email. Please try again later.'),
        { statusCode: 500 }
      );
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
