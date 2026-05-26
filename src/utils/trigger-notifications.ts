import prisma from '../models/prisma.js';
import { notificationService } from '../services/notification.service.js';
import { getRandomQuote } from './scheduler.js';

async function trigger() {
  console.log('🔍 Fetching all active user accounts...');
  const users = await prisma.user.findMany({
    where: { is_active: true },
    select: { user_id: true, name: true, email: true },
  });

  if (users.length === 0) {
    console.log('❌ No active users found in the database. Please register/login first!');
    return;
  }

  console.log(`🚀 Found ${users.length} active users. Broadcasting test notifications...`);

  for (const user of users) {
    console.log(`👉 Sending notifications to: ${user.name} (${user.email})`);

    // 1. Seed FR-14 Daily Meal Reminder
    await notificationService.createNotification(
      user.user_id,
      'reminder',
      "🍳 Daily Reminder: Don't forget to log your meals today to keep your calorie goals perfectly on track!"
    );

    // 2. Seed FR-15 Daily Motivation
    await notificationService.createNotification(
      user.user_id,
      'motivation',
      getRandomQuote()
    );
  }

  console.log('✅ Successfully triggered manual FR-14 & FR-15 notifications!');
  console.log('🔔 Open the NutriGuide web app and click the Notification Bell to check them!');
}

trigger()
  .catch((err) => {
    console.error('❌ Failed to trigger notifications:', err);
  })
  .finally(() => {
    prisma.$disconnect();
  });
