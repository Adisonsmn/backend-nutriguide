import { Router } from 'express';
import { historyController } from '../controllers/history.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const addHistorySchema = z.object({
  food_id: z.string().min(1, 'Food ID is required'),
  qty_gram: z.number().positive('Quantity must be positive'),
  consumed_at: z.string().datetime().optional(),
});

router.post('/', verifyToken, validate(addHistorySchema), historyController.addHistory);
router.get('/', verifyToken, historyController.getHistory);
router.get('/summary', verifyToken, historyController.getSummary);
router.delete('/:historyId', verifyToken, historyController.deleteHistory);

export default router;
