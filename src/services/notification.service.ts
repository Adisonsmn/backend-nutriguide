import prisma from '../models/prisma.js';
import { generateId } from '../utils/idGenerator.js';

export const notificationService = {
  async getSettings(userId: string) {
    return prisma.notification.findMany({
      where: { user_id: userId, is_sent: false },
      orderBy: { scheduled_at: 'asc' },
    });
  },

  async upsertSettings(userId: string, type: string, message: string, scheduledAt: string) {
    const notif_id = await generateId('NOTF', 'notifications', 'notif_id');

    return prisma.notification.create({
      data: {
        notif_id,
        user_id: userId,
        type,
        message,
        scheduled_at: new Date(scheduledAt),
      },
    });
  },

  async getDailyNotifications(userId: string) {
    const today = new Date();
    const startOfDay = new Date(today);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(today);
    endOfDay.setHours(23, 59, 59, 999);

    return prisma.notification.findMany({
      where: {
        user_id: userId,
        scheduled_at: { gte: startOfDay, lte: endOfDay },
        is_sent: false,
      },
      orderBy: { scheduled_at: 'asc' },
    });
  },

  // Placeholder for push notification token management
  async saveDeviceToken(_userId: string, _deviceToken: string, _platform: string) {
    // In a real implementation, store this in a device_tokens table
    return { message: 'Device token saved successfully' };
  },

  async deleteDeviceToken(_userId: string) {
    // In a real implementation, remove device token from storage
    return { message: 'Device token removed successfully' };
  },
};
