import { Express } from 'express';
import authRoutes from './auth.routes.js';
import profileRoutes from './profile.routes.js';
import foodRoutes from './food.routes.js';
import nutritionRoutes from './nutrition.routes.js';
import recommendationRoutes from './recommendation.routes.js';
import recipeRoutes from './recipe.routes.js';
import historyRoutes from './history.routes.js';
import articleRoutes from './article.routes.js';
import notificationRoutes from './notification.routes.js';

export const registerRoutes = (app: Express): void => {
  app.use('/api/auth', authRoutes);
  app.use('/api/profile', profileRoutes);
  app.use('/api/foods', foodRoutes);
  app.use('/api/nutrition', nutritionRoutes);
  app.use('/api/recommendations', recommendationRoutes);
  app.use('/api/recipes', recipeRoutes);
  app.use('/api/history', historyRoutes);
  app.use('/api/articles', articleRoutes);
  app.use('/api/notifications', notificationRoutes);
};
