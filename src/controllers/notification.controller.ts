import { Request, Response, NextFunction } from 'express';
import { notificationService } from '../services/notification.service.js';

export const notificationController = {
  async getNotifications(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const notifications = await notificationService.getNotifications(userId);
      res.status(200).json({
        status: 'success',
        message: 'Notifications retrieved successfully',
        data: notifications,
      });
    } catch (error) {
      next(error);
    }
  },

  async getUnreadCount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const count = await notificationService.getUnreadCount(userId);
      res.status(200).json({
        status: 'success',
        message: 'Unread count retrieved',
        data: { count },
      });
    } catch (error) {
      next(error);
    }
  },

  async markAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { notifId } = req.params;
      await notificationService.markAsRead(notifId, userId);
      res.status(200).json({
        status: 'success',
        message: 'Notification marked as read',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },

  async markAllAsRead(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      await notificationService.markAllAsRead(userId);
      res.status(200).json({
        status: 'success',
        message: 'All notifications marked as read',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
