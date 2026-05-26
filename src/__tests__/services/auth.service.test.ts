import { vi } from 'vitest';
// Stub setInterval before importing the service to prevent interval leaks
vi.stubGlobal('setInterval', vi.fn());

import { describe, it, expect, beforeEach } from 'vitest';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { prismaMock } from '../__mocks__/prisma';
import { authService } from '../../services/auth.service';
import { notificationService } from '../../services/notification.service';
import { generateId } from '../../utils/idGenerator';
import { sendOtpEmail } from '../../utils/email';

vi.mock('bcrypt');
vi.mock('jsonwebtoken');
vi.mock('../../utils/idGenerator', () => ({
  generateId: vi.fn(),
}));
vi.mock('../../utils/email', () => ({
  sendOtpEmail: vi.fn(),
}));
vi.mock('../../services/notification.service', () => ({
  notificationService: {
    createNotification: vi.fn().mockResolvedValue({ notif_id: 'NOTF-001' }),
  },
}));

describe('auth.service', () => {
  beforeEach(() => {
    process.env.JWT_SECRET = 'access-secret';
    process.env.JWT_REFRESH_SECRET = 'refresh-secret';
    vi.clearAllMocks();
  });

  describe('register', () => {
    it('should throw a 409 error if email is already registered', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ user_id: 'USER-1' } as any);

      await expect(
        authService.register('John', 'john@example.com', 'pwd123')
      ).rejects.toMatchObject({
        message: 'Email already registered',
        statusCode: 409,
      });
    });

    it('should successfully hash password, generate custom USER ID, and create a user', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);
      vi.mocked(bcrypt.hash).mockImplementationOnce(() => Promise.resolve('hashed-password'));
      vi.mocked(generateId).mockResolvedValueOnce('USER-001');
      prismaMock.user.create.mockResolvedValueOnce({
        user_id: 'USER-001',
        name: 'John',
        email: 'john@example.com',
      } as any);

      const result = await authService.register('John', 'john@example.com', 'pwd123');

      expect(result).toEqual({
        user_id: 'USER-001',
        name: 'John',
        email: 'john@example.com',
      });
      expect(bcrypt.hash).toHaveBeenCalledWith('pwd123', 10);
      expect(generateId).toHaveBeenCalledWith('USER', 'users', 'user_id');
      expect(prismaMock.user.create).toHaveBeenCalledWith({
        data: {
          user_id: 'USER-001',
          name: 'John',
          email: 'john@example.com',
          password_hash: 'hashed-password',
        },
        select: {
          user_id: true,
          name: true,
          email: true,
          is_active: true,
          created_at: true,
          updated_at: true,
        },
      });
    });
  });

  describe('login', () => {
    it('should throw 401 if user is not registered', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.login('not-registered@example.com', 'pwd')).rejects.toMatchObject({
        message: 'Email not registered',
        statusCode: 401,
      });
    });

    it('should throw 401 if password check fails', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        user_id: 'USER-1',
        password_hash: 'hash',
      } as any);
      vi.mocked(bcrypt.compare).mockImplementationOnce(() => Promise.resolve(false));

      await expect(authService.login('john@example.com', 'pwd')).rejects.toMatchObject({
        message: 'Incorrect password',
        statusCode: 401,
      });
    });

    it('should issue tokens, store session in database, and notify user on successful login (Bug #5)', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        user_id: 'USER-001',
        name: 'John',
        email: 'john@example.com',
        password_hash: 'hash',
      } as any);
      vi.mocked(bcrypt.compare).mockImplementationOnce(() => Promise.resolve(true));
      vi.mocked(jwt.sign)
        .mockReturnValueOnce('access-token' as any)
        .mockReturnValueOnce('refresh-token' as any);
      vi.mocked(bcrypt.hash).mockImplementationOnce(() => Promise.resolve('token-hash'));
      vi.mocked(generateId).mockResolvedValueOnce('SESS-123');

      const result = await authService.login('john@example.com', 'pwd123');

      expect(result.accessToken).toBe('access-token');
      expect(result.refreshToken).toBe('refresh-token');
      expect(result.user).toEqual({
        user_id: 'USER-001',
        name: 'John',
        email: 'john@example.com',
      });

      // Verify Bug #5: Store in DB session
      expect(prismaMock.session.create).toHaveBeenCalledWith({
        data: {
          session_id: 'SESS-123',
          user_id: 'USER-001',
          token_hash: 'token-hash',
          expires_at: expect.any(Date),
        },
      });

      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-001',
        'login',
        expect.stringContaining('Welcome back, John!')
      );
    });
  });

  describe('logout', () => {
    it('should delete database session matching the refresh token (Bug #5)', async () => {
      prismaMock.session.findMany.mockResolvedValueOnce([
        { session_id: 'SESS-1', token_hash: 'hash-1' },
        { session_id: 'SESS-2', token_hash: 'hash-2' },
      ] as any);

      // First comparison fails, second matches
      vi.mocked(bcrypt.compare)
        .mockResolvedValueOnce(false)
        .mockResolvedValueOnce(true);

      await authService.logout('my-refresh-token', 'USER-001');

      expect(prismaMock.session.findMany).toHaveBeenCalledWith({
        where: { user_id: 'USER-001' },
      });
      expect(prismaMock.session.delete).toHaveBeenCalledWith({
        where: { session_id: 'SESS-2' },
      });
    });
  });

  describe('refreshAccessToken', () => {
    it('should throw 401 if refresh token JWT verification fails', async () => {
      vi.mocked(jwt.verify).mockImplementationOnce(() => {
        throw new Error('invalid signature');
      });

      await expect(authService.refreshAccessToken('bad-token')).rejects.toMatchObject({
        message: 'Invalid or expired refresh token',
        statusCode: 401,
      });
    });

    it('should throw 401 if no active database session matches the token', async () => {
      vi.mocked(jwt.verify).mockReturnValueOnce({ userId: 'USER-001', email: 'john@example.com' } as any);
      prismaMock.session.findMany.mockResolvedValueOnce([
        { session_id: 'SESS-1', token_hash: 'hash-1', expires_at: new Date(Date.now() + 100000) },
      ] as any);
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false); // No match

      await expect(authService.refreshAccessToken('token')).rejects.toMatchObject({
        message: 'Invalid refresh token',
        statusCode: 401,
      });
    });

    it('should issue new access token on successful validation against database sessions', async () => {
      vi.mocked(jwt.verify).mockReturnValueOnce({ userId: 'USER-001', email: 'john@example.com' } as any);
      prismaMock.session.findMany.mockResolvedValueOnce([
        { session_id: 'SESS-1', token_hash: 'hash-1', expires_at: new Date(Date.now() + 100000) },
      ] as any);
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(true); // Matches
      vi.mocked(jwt.sign).mockReturnValueOnce('new-access-token' as any);

      const result = await authService.refreshAccessToken('valid-refresh-token');

      expect(result.accessToken).toBe('new-access-token');
      expect(jwt.sign).toHaveBeenCalledWith(
        { userId: 'USER-001', email: 'john@example.com' },
        'access-secret',
        expect.any(Object)
      );
    });
  });

  describe('forgotPassword', () => {
    it('should throw 404 if email is not found', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.forgotPassword('nonexistent@example.com')).rejects.toMatchObject({
        message: 'Email not found',
        statusCode: 404,
      });
    });

    it('should generate OTP and trigger email sending', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ email: 'john@example.com' } as any);
      prismaMock.user.update.mockResolvedValueOnce({} as any);
      vi.mocked(sendOtpEmail).mockResolvedValueOnce(undefined);

      const result = await authService.forgotPassword('john@example.com');

      expect(result.message).toBe('OTP has been sent to your email address.');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        data: {
          reset_otp: expect.stringMatching(/^\d{6}$/),
          reset_otp_expires: expect.any(Date),
        },
      });
      expect(sendOtpEmail).toHaveBeenCalledWith('john@example.com', expect.stringMatching(/^\d{6}$/));
    });

    it('should throw 500 and NEVER return the OTP to client if email sending fails (Bug #1)', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({ email: 'john@example.com' } as any);
      prismaMock.user.update.mockResolvedValueOnce({} as any);
      vi.mocked(sendOtpEmail).mockRejectedValueOnce(new Error('SMTP error'));

      await expect(authService.forgotPassword('john@example.com')).rejects.toMatchObject({
        message: 'Failed to send OTP email. Please try again later.',
        statusCode: 500,
      });
    });
  });

  describe('resetPassword', () => {
    it('should throw 404 if email not found', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce(null);

      await expect(authService.resetPassword('email', '123456', 'pwd')).rejects.toMatchObject({
        message: 'Email not found',
        statusCode: 404,
      });
    });

    it('should throw 400 if OTP is invalid', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        email: 'john@example.com',
        reset_otp: '123456',
      } as any);

      await expect(authService.resetPassword('john@example.com', 'wrong', 'pwd')).rejects.toMatchObject({
        message: 'Invalid OTP',
        statusCode: 400,
      });
    });

    it('should throw 400 if OTP has expired', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        email: 'john@example.com',
        reset_otp: '123456',
        reset_otp_expires: new Date(Date.now() - 1000), // expired
      } as any);

      await expect(authService.resetPassword('john@example.com', '123456', 'pwd')).rejects.toMatchObject({
        message: 'OTP has expired',
        statusCode: 400,
      });
    });

    it('should throw 400 if new password matches old password', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        email: 'john@example.com',
        reset_otp: '123456',
        reset_otp_expires: new Date(Date.now() + 100000),
        password_hash: 'old-hash',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(true); // Same password

      await expect(authService.resetPassword('john@example.com', '123456', 'old-password')).rejects.toMatchObject({
        message: 'New password must be different from your current password',
        statusCode: 400,
      });
    });

    it('should successfully update password hash, reset OTP fields, and send success notification', async () => {
      prismaMock.user.findUnique.mockResolvedValueOnce({
        user_id: 'USER-001',
        email: 'john@example.com',
        reset_otp: '123456',
        reset_otp_expires: new Date(Date.now() + 100000),
        password_hash: 'old-hash',
      } as any);
      vi.mocked(bcrypt.compare).mockResolvedValueOnce(false); // Different
      vi.mocked(bcrypt.hash).mockResolvedValueOnce('new-hashed-password' as never);

      const result = await authService.resetPassword('john@example.com', '123456', 'new-password');

      expect(result.message).toBe('Password reset successfully');
      expect(prismaMock.user.update).toHaveBeenCalledWith({
        where: { email: 'john@example.com' },
        data: {
          password_hash: 'new-hashed-password',
          reset_otp: null,
          reset_otp_expires: null,
        },
      });
      expect(notificationService.createNotification).toHaveBeenCalledWith(
        'USER-001',
        'password',
        expect.stringContaining('successfully')
      );
    });
  });
});
