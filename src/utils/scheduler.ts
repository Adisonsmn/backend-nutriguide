import cron from 'node-cron';
import prisma from '../models/prisma.js';
import { notificationService } from '../services/notification.service.js';

/* ─── Motivational health quotes pool ─── */
const MOTIVATIONAL_QUOTES: string[] = [
  "💪 You are what you eat — fuel your body with greatness today!",
  "🌱 Small healthy choices every day lead to big life changes. Keep going!",
  "🥦 Your body deserves the best nutrition. Make today's meals count!",
  "🏃 Consistency is key — one healthy meal at a time builds a better you!",
  "🍎 An apple a day keeps the doctor away — and so does every healthy choice!",
  "⚡ Energy comes from the food you eat. Choose wisely and feel the difference!",
  "🌟 You're doing amazing! Stay committed to your health journey today.",
  "🥗 Nourish your body, feed your dreams. Healthy eating = healthy living!",
  "💧 Don't forget to stay hydrated — water is the foundation of good health!",
  "🎯 Every healthy meal is a step closer to your goals. You've got this!",
];

/**
 * Pick a random message from the motivational quotes list.
 */
export const getRandomQuote = (): string => {
  const idx = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length);
  return MOTIVATIONAL_QUOTES[idx];
};

/**
 * Fetch all active user IDs from the database.
 */
export const getActiveUserIds = async (): Promise<string[]> => {
  const users = await prisma.user.findMany({
    where: { is_active: true },
    select: { user_id: true },
  });
  return users.map((u) => u.user_id);
};

/**
 * Send a notification to all active users using Promise.allSettled
 * so that individual failures never crash the scheduler.
 */
export const broadcastNotification = async (
  type: string,
  message: string,
  label: string
): Promise<void> => {
  try {
    // Bug #20: Check if this notification type was already sent today (idempotency)
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const alreadySent = await prisma.notification.findFirst({
      where: {
        type,
        created_date: { gte: startOfToday },
      },
    });

    if (alreadySent) {
      console.log(`[Scheduler] ${label} already sent today, skipping.`);
      return;
    }

    const userIds = await getActiveUserIds();
    if (userIds.length === 0) {
      console.log(`[Scheduler] No active users found for ${label} notification.`);
      return;
    }

    const results = await Promise.allSettled(
      userIds.map((userId) =>
        notificationService.createNotification(userId, type, message)
      )
    );

    const failed = results.filter((r) => r.status === 'rejected');
    const succeeded = results.length - failed.length;

    console.log(
      `[Scheduler] ${label}: sent to ${succeeded}/${userIds.length} users.` +
        (failed.length > 0 ? ` ${failed.length} failed.` : '')
    );

    failed.forEach((r) => {
      if (r.status === 'rejected') {
        console.error(`[Scheduler] ${label} error:`, r.reason);
      }
    });
  } catch (err) {
    console.error(`[Scheduler] Failed to broadcast ${label} notification:`, err);
  }
};

/**
 * Initialize and start all scheduled cron jobs.
 * Call this once after the server starts.
 */
export const startScheduler = (): void => {
  // ── Meal Reminder — 07:00 WIB (00:00 UTC) ──
  cron.schedule(
    '0 0 * * *',
    async () => {
      console.log('[Scheduler] 🍳 Running daily meal reminder job (07:00 WIB)...');
      await broadcastNotification(
        'reminder',
        "Good morning! Don't forget to log your breakfast today 🍳",
        'Meal Reminder'
      );
    },
    { timezone: 'UTC' }
  );

  // ── Daily Motivation — 08:00 WIB (01:00 UTC) ──
  cron.schedule(
    '0 1 * * *',
    async () => {
      console.log('[Scheduler] 💪 Running daily motivation job (08:00 WIB)...');
      await broadcastNotification(
        'motivation',
        getRandomQuote(),
        'Daily Motivation'
      );
    },
    { timezone: 'UTC' }
  );

  console.log('✅ Scheduler started: meal reminder @ 07:00 WIB, motivation @ 08:00 WIB');
};
