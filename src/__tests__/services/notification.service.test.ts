import { describe, it, expect, vi, beforeEach } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import { notificationService } from '../../services/notification.service';
import { generateId } from '../../utils/idGenerator';

vi.mock('../../utils/idGenerator', () => ({
  generateId: vi.fn().mockResolvedValue('NOTF-001'),
}));

describe('notification.service', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ─── createNotification ──────────────────────────────────────────────────────

  describe('createNotification', () => {
    it('should generate a NOTF- prefixed ID and create a notification in the database', async () => {
      const mockNotif = {
        notif_id: 'NOTF-001',
        user_id: 'USER-001',
        type: 'login',
        message: 'Welcome back, John!',
        scheduled_at: new Date(),
        is_sent: true,
      };
      prismaMock.notification.create.mockResolvedValueOnce(mockNotif as any);

      const result = await notificationService.createNotification(
        'USER-001',
        'login',
        'Welcome back, John!'
      );

      expect(result.notif_id).toBe('NOTF-001');
      expect(result.type).toBe('login');
      expect(result.message).toBe('Welcome back, John!');
      expect(generateId).toHaveBeenCalledWith('NOTF', 'notifications', 'notif_id');
      expect(prismaMock.notification.create).toHaveBeenCalledWith({
        data: {
          notif_id: 'NOTF-001',
          user_id: 'USER-001',
          type: 'login',
          message: 'Welcome back, John!',
          scheduled_at: expect.any(Date),
          is_sent: true,
        },
      });
    });

    it('should create a notification with type "password" when password is reset', async () => {
      const mockNotif = {
        notif_id: 'NOTF-002',
        user_id: 'USER-001',
        type: 'password',
        message: 'Your password has been changed successfully',
        scheduled_at: new Date(),
        is_sent: true,
      };
      vi.mocked(generateId).mockResolvedValueOnce('NOTF-002');
      prismaMock.notification.create.mockResolvedValueOnce(mockNotif as any);

      const result = await notificationService.createNotification(
        'USER-001',
        'password',
        'Your password has been changed successfully'
      );

      expect(result.type).toBe('password');
      expect(result.notif_id).toBe('NOTF-002');
    });
  });

  // ─── getNotifications ─────────────────────────────────────────────────────────

  describe('getNotifications', () => {
    it('should return notifications for a user with default limit of 20', async () => {
      const mockNotifs = [
        { notif_id: 'NOTF-001', user_id: 'USER-001', message: 'msg1' },
        { notif_id: 'NOTF-002', user_id: 'USER-001', message: 'msg2' },
      ];
      prismaMock.notification.findMany.mockResolvedValueOnce(mockNotifs as any);

      const result = await notificationService.getNotifications('USER-001');

      expect(result).toHaveLength(2);
      expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { user_id: 'USER-001' },
        orderBy: { created_date: 'desc' },
        take: 20,
      });
    });

    it('should return notifications with a custom limit', async () => {
      prismaMock.notification.findMany.mockResolvedValueOnce([
        { notif_id: 'NOTF-001', user_id: 'USER-001', message: 'msg1' },
      ] as any);

      await notificationService.getNotifications('USER-001', 5);

      expect(prismaMock.notification.findMany).toHaveBeenCalledWith({
        where: { user_id: 'USER-001' },
        orderBy: { created_date: 'desc' },
        take: 5,
      });
    });

    it('should return an empty array if the user has no notifications', async () => {
      prismaMock.notification.findMany.mockResolvedValueOnce([]);

      const result = await notificationService.getNotifications('USER-999');

      expect(result).toEqual([]);
    });
  });

  // ─── getUnreadCount ───────────────────────────────────────────────────────────

  describe('getUnreadCount', () => {
    it('should return the count of unread notifications for a user', async () => {
      prismaMock.notification.count.mockResolvedValueOnce(3);

      const result = await notificationService.getUnreadCount('USER-001');

      expect(result).toBe(3);
      expect(prismaMock.notification.count).toHaveBeenCalledWith({
        where: { user_id: 'USER-001', is_read: false },
      });
    });

    it('should return 0 if all notifications have been read', async () => {
      prismaMock.notification.count.mockResolvedValueOnce(0);

      const result = await notificationService.getUnreadCount('USER-001');

      expect(result).toBe(0);
    });
  });

  // ─── markAsRead ───────────────────────────────────────────────────────────────

  describe('markAsRead', () => {
    it('should mark a specific notification as read for the correct user', async () => {
      prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 1 });

      const result = await notificationService.markAsRead('NOTF-001', 'USER-001');

      expect(result.count).toBe(1);
      expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
        where: { notif_id: 'NOTF-001', user_id: 'USER-001' },
        data: { is_read: true },
      });
    });

    it('should return count 0 if the notification does not belong to the user', async () => {
      // updateMany returns count:0 when no rows matched the where clause
      prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 0 });

      const result = await notificationService.markAsRead('NOTF-001', 'USER-OTHER');

      expect(result.count).toBe(0);
    });
  });

  // ─── markAllAsRead ────────────────────────────────────────────────────────────

  describe('markAllAsRead', () => {
    it('should mark all unread notifications as read for a user', async () => {
      prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 5 });

      const result = await notificationService.markAllAsRead('USER-001');

      expect(result.count).toBe(5);
      expect(prismaMock.notification.updateMany).toHaveBeenCalledWith({
        where: { user_id: 'USER-001', is_read: false },
        data: { is_read: true },
      });
    });

    it('should return count 0 if there are no unread notifications to mark', async () => {
      prismaMock.notification.updateMany.mockResolvedValueOnce({ count: 0 });

      const result = await notificationService.markAllAsRead('USER-001');

      expect(result.count).toBe(0);
    });
  });
});
