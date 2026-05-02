import { Request, Response, NextFunction } from 'express';
import { profileService } from '../services/profile.service.js';

export const profileController = {
  async createProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.createProfile(userId, req.body);
      res.status(201).json({
        status: 'success',
        message: 'Profile created successfully',
        data: profile,
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

  async getProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const data = await profileService.getProfile(userId);
      res.status(200).json({
        status: 'success',
        message: 'Profile retrieved successfully',
        data,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const profile = await profileService.updateProfile(userId, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Profile updated successfully',
        data: profile,
      });
    } catch (error) {
      next(error);
    }
  },

  async getPreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const preferences = await profileService.getPreferences(userId);
      res.status(200).json({
        status: 'success',
        message: 'Preferences retrieved successfully',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  },

  async updatePreferences(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const preferences = await profileService.upsertPreferences(userId, req.body);
      res.status(200).json({
        status: 'success',
        message: 'Preferences updated successfully',
        data: preferences,
      });
    } catch (error) {
      next(error);
    }
  },
};
