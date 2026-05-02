import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const updateSettingsSchema = z.object({
  type: z.string().min(1),
  message: z.string().min(1),
  scheduled_at: z.string().datetime(),
});

const deviceTokenSchema = z.object({
  device_token: z.string().min(1),
  platform: z.string().min(1),
});

router.get('/settings', verifyToken, notificationController.getSettings);
router.put('/settings', verifyToken, validate(updateSettingsSchema), notificationController.updateSettings);
router.get('/daily', verifyToken, notificationController.getDailyNotifications);
router.post('/token', verifyToken, validate(deviceTokenSchema), notificationController.saveDeviceToken);
router.delete('/token', verifyToken, notificationController.deleteDeviceToken);

export default router;
