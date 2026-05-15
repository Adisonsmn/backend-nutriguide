import prisma from '../models/prisma.js';
import { generateId } from '../utils/idGenerator.js';

export const notificationService = {
  /**
   * Create a new notification for a user.
   * Called by other services when an activity occurs.
   */
  async createNotification(userId: string, type: string, message: string) {
    const notif_id = await generateId('NOTF', 'notifications', 'notif_id');

    return prisma.notification.create({
      data: {
        notif_id,
        user_id: userId,
        type,
        message,
        scheduled_at: new Date(),
        is_sent: true,
      },
    });
  },

  /**
   * Get all notifications for a user, newest first.
   */
  async getNotifications(userId: string, limit = 20) {
    return prisma.notification.findMany({
      where: { user_id: userId },
      orderBy: { created_date: 'desc' },
      take: limit,
    });
  },

  /**
   * Get count of unread notifications.
   */
  async getUnreadCount(userId: string) {
    return prisma.notification.count({
      where: { user_id: userId, is_read: false },
    });
  },

  /**
   * Mark a single notification as read.
   */
  async markAsRead(notifId: string, userId: string) {
    return prisma.notification.updateMany({
      where: { notif_id: notifId, user_id: userId },
      data: { is_read: true },
    });
  },

  /**
   * Mark all notifications as read for a user.
   */
  async markAllAsRead(userId: string) {
    return prisma.notification.updateMany({
      where: { user_id: userId, is_read: false },
      data: { is_read: true },
    });
  },
};
