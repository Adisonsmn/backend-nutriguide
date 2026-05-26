import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { prismaMock } from '../__mocks__/prisma';
import cron from 'node-cron';
import { notificationService } from '../../services/notification.service';
import {
  getRandomQuote,
  getActiveUserIds,
  broadcastNotification,
  startScheduler,
} from '../../utils/scheduler';

// Mock node-cron
vi.mock('node-cron', () => ({
  default: {
    schedule: vi.fn(),
  },
}));

describe('scheduler - utility & job runner', () => {
  let consoleLogSpy: any;
  let consoleErrorSpy: any;

  beforeEach(() => {
    consoleLogSpy = vi.spyOn(console, 'log').mockImplementation(() => {});
    consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    vi.restoreAllMocks();
  });

  describe('getRandomQuote', () => {
    it('should return a non-empty string', () => {
      const quote = getRandomQuote();
      expect(typeof quote).toBe('string');
      expect(quote.length).toBeGreaterThan(0);
    });
  });

  describe('getActiveUserIds', () => {
    it('should fetch user_id of active users from database', async () => {
      prismaMock.user.findMany.mockResolvedValueOnce([
        { user_id: 'USER-001' },
        { user_id: 'USER-002' },
      ] as any);

      const ids = await getActiveUserIds();
      expect(ids).toEqual(['USER-001', 'USER-002']);
      expect(prismaMock.user.findMany).toHaveBeenCalledWith({
        where: { is_active: true },
        select: { user_id: true },
      });
    });
  });

  describe('broadcastNotification', () => {
    it('should skip if notification of this type has already been sent today (idempotency check)', async () => {
      // Mock findFirst to return an existing notification (already sent)
      prismaMock.notification.findFirst.mockResolvedValueOnce({
        notif_id: 'NOTF-001',
      } as any);

      await broadcastNotification('reminder', 'Hello', 'Meal Reminder');

      // Should check if already sent today
      expect(prismaMock.notification.findFirst).toHaveBeenCalled();
      // Should NOT get active users or create any notifications
      expect(prismaMock.user.findMany).not.toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('Meal Reminder already sent today, skipping.')
      );
    });

    it('should skip if no active users are found', async () => {
      // Mock no existing notification sent today
      prismaMock.notification.findFirst.mockResolvedValueOnce(null);
      // Mock empty list of active users
      prismaMock.user.findMany.mockResolvedValueOnce([]);

      await broadcastNotification('reminder', 'Hello', 'Meal Reminder');

      expect(prismaMock.user.findMany).toHaveBeenCalled();
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('No active users found for Meal Reminder notification.')
      );
    });

    it('should broadcast notification to all active users, handling individual successes and failures', async () => {
      // Mock no existing notification sent today
      prismaMock.notification.findFirst.mockResolvedValueOnce(null);
      // Mock active users
      prismaMock.user.findMany.mockResolvedValueOnce([
        { user_id: 'USER-001' },
        { user_id: 'USER-002' },
      ] as any);

      // Spy on createNotification: make one succeed and one fail
      const createSpy = vi.spyOn(notificationService, 'createNotification');
      createSpy
        .mockResolvedValueOnce({ notif_id: 'NOTF-001' } as any) // USER-001 success
        .mockRejectedValueOnce(new Error('SMTP failure')); // USER-002 fail

      await broadcastNotification('reminder', 'Log breakfast!', 'Meal Reminder');

      expect(createSpy).toHaveBeenCalledTimes(2);
      expect(createSpy).toHaveBeenNthCalledWith(1, 'USER-001', 'reminder', 'Log breakfast!');
      expect(createSpy).toHaveBeenNthCalledWith(2, 'USER-002', 'reminder', 'Log breakfast!');

      // Should log the results and error
      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Scheduler] Meal Reminder: sent to 1/2 users. 1 failed.')
      );
      expect(consoleErrorSpy).toHaveBeenCalledWith(
        expect.stringContaining('[Scheduler] Meal Reminder error:'),
        expect.any(Error)
      );
    });
  });

  describe('startScheduler', () => {
    it('should register daily meal reminder and motivation jobs with correct time and timezone', () => {
      startScheduler();

      // Should have registered two jobs
      expect(cron.schedule).toHaveBeenCalledTimes(2);
      
      // Verification of 1st cron job (Meal Reminder @ 07:00 WIB / 00:00 UTC)
      expect(cron.schedule).toHaveBeenNthCalledWith(
        1,
        '0 0 * * *',
        expect.any(Function),
        { timezone: 'UTC' }
      );

      // Verification of 2nd cron job (Daily Motivation @ 08:00 WIB / 01:00 UTC)
      expect(cron.schedule).toHaveBeenNthCalledWith(
        2,
        '0 1 * * *',
        expect.any(Function),
        { timezone: 'UTC' }
      );

      expect(consoleLogSpy).toHaveBeenCalledWith(
        expect.stringContaining('✅ Scheduler started:')
      );
    });
  });
});
