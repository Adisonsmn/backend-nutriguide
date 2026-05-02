import { Request, Response, NextFunction } from 'express';
import { historyService } from '../services/history.service.js';

export const historyController = {
  async addHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { food_id, qty_gram, consumed_at } = req.body;
      const entry = await historyService.addHistory(userId, food_id, qty_gram, consumed_at);
      res.status(201).json({
        status: 'success',
        message: 'Food history added successfully',
        data: entry,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async getHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const date = req.query.date as string | undefined;
      const history = await historyService.getHistory(userId, date);
      res.status(200).json({
        status: 'success',
        message: 'Food history retrieved successfully',
        data: history,
      });
    } catch (error) {
      next(error);
    }
  },

  async deleteHistory(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const { historyId } = req.params;
      await historyService.deleteHistory(userId, historyId);
      res.status(200).json({
        status: 'success',
        message: 'Food history deleted successfully',
        data: null,
      });
    } catch (error: unknown) {
      const err = error as Error & { statusCode?: number };
      if (err.statusCode) {
        res.status(err.statusCode).json({
          status: 'error',
          message: err.message,
          data: null,
        });
        return;
      }
      next(error);
    }
  },

  async getSummary(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user!.userId;
      const summary = await historyService.getSummary(userId);
      res.status(200).json({
        status: 'success',
        message: 'Daily summary retrieved successfully',
        data: summary,
      });
    } catch (error) {
      next(error);
    }
  },
};
