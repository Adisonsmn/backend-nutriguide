import { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth.service.js';

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  path: '/',
};

export const authController = {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, email, password } = req.body;
      const user = await authService.register(name, email, password);
      res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: user,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const result = await authService.login(email, password);

      // Bug #8: Set refresh token as HTTP-only cookie instead of sending in JSON body
      res.cookie('refreshToken', result.refreshToken, REFRESH_COOKIE_OPTIONS);

      res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
          accessToken: result.accessToken,
          user: result.user,
        },
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      // Bug #8: Read refresh token from cookie
      const refreshToken = req.cookies?.refreshToken;
      const userId = req.user!.userId;

      if (refreshToken) {
        await authService.logout(refreshToken, userId);
      }

      // Clear the cookie
      res.clearCookie('refreshToken', { path: '/' });

      res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async refreshToken(req: Request, res: Response, next: NextFunction) {
    try {
      // Bug #8: Read refresh token from cookie instead of body
      const refreshToken = req.cookies?.refreshToken || req.body?.refreshToken;

      if (!refreshToken) {
        res.status(401).json({
          status: 'error',
          message: 'Refresh token is missing',
          data: null,
        });
        return;
      }

      const result = await authService.refreshAccessToken(refreshToken);
      res.status(200).json({
        status: 'success',
        message: 'Token refreshed successfully',
        data: result,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        // If refresh fails, clear the stale cookie
        res.clearCookie('refreshToken', { path: '/' });
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async forgotPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email } = req.body;
      const result = await authService.forgotPassword(email);
      res.status(200).json({
        status: 'success',
        message: 'Forgot password initiated',
        data: result,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async resetPassword(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await authService.resetPassword(email, otp, newPassword);
      res.status(200).json({
        status: 'success',
        message: 'Password reset successful',
        data: result,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },
};
