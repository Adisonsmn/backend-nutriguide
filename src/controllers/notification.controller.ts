import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  async getSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const notifications = await notificationService.getSettings(userId);
      res.status(200).json({
        status: 'success',
        message: 'Notification settings retrieved successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  async updateSettings(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { type, message, scheduled_at } = req.body;
      const notification = await notificationService.upsertSettings(
        userId,
        type,
        message,
        scheduled_at
      );
      res.status(200).json({
        status: 'success',
        message: 'Notification settings updated successfully',
        data: notification,
      });
    } catch (error) {
      next(error);
    }
  },

  async getDailyNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const notifications = await notificationService.getDailyNotifications(userId);
      res.status(200).json({
        status: 'success',
        message: 'Daily notifications retrieved successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  async saveDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { device_token, platform } = req.body;
      const result = await notificationService.saveDeviceToken(userId, device_token, platform);
      res.status(201).json({
        status: 'success',
        message: result.message,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteDeviceToken(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const result = await notificationService.deleteDeviceToken(userId);
      res.status(200).json({
        status: 'success',
        message: result.message,
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
