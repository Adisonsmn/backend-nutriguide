import { Router } from 'express';
import { notificationController } from '../controllers/notification.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';

const router = Router();

// Bug #9: Specific static paths BEFORE parameterized routes to prevent interception
router.get('/unread-count', verifyToken, notificationController.getUnreadCount);
router.patch('/read-all', verifyToken, notificationController.markAllAsRead);
router.patch('/:notifId/read', verifyToken, notificationController.markAsRead);
router.get('/', verifyToken, notificationController.getNotifications);

export default router;
