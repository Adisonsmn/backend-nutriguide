import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

router.get('/', verifyToken, notificationController.getNotifications);
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.patch('/:notifId/read', verifyToken, notificationController.markAsRead);
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);

export default router;
