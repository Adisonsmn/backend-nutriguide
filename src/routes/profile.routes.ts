import { Router } from 'express';
import { profileController } from '../controllers/profile.controller.js';
import { verifyToken } from '../middlewares/auth.middleware.js';
import { validate } from '../middlewares/validate.middleware.js';
import { z } from 'zod';

const router = Router();

const createProfileSchema = z.object({
  age: z.number().int().min(1).max(150),
  weight_kg: z.number().positive(),
  height_cm: z.number().positive(),
  gender: z.string().min(1),
  goal: z.string().min(1),
});

const updateProfileSchema = z.object({
  age: z.number().int().min(1).max(150).optional(),
  weight_kg: z.number().positive().optional(),
  height_cm: z.number().positive().optional(),
  gender: z.string().min(1).optional(),
  goal: z.string().min(1).optional(),
});

const preferencesSchema = z.object({
  diet_type: z.string().min(1),
  daily_budget: z.number().positive(),
  currency: z.string().optional(),
});

router.post('/', verifyToken, validate(createProfileSchema), profileController.createProfile);
router.get('/', verifyToken, profileController.getProfile);
router.put('/', verifyToken, validate(updateProfileSchema), profileController.updateProfile);
router.get('/preferences', verifyToken, profileController.getPreferences);
router.put('/preferences', verifyToken, validate(preferencesSchema), profileController.updatePreferences);

export default router;
