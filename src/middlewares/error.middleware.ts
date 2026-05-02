import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import jwt from 'jsonwebtoken';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  console.error('Error:', err.message);

  // Prisma known request error
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case 'P2002': {
        const target = (err.meta?.target as string[]) || [];
        res.status(409).json({
          status: 'error',
          message: `Duplicate value on field: ${target.join(', ')}`,
          data: null,
        });
        return;
      }
      case 'P2025':
        res.status(404).json({
          status: 'error',
          message: 'Record not found',
          data: null,
        });
        return;
      default:
        res.status(400).json({
          status: 'error',
          message: `Database error: ${err.message}`,
          data: null,
        });
        return;
    }
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      status: 'error',
      message: 'Invalid data provided',
      data: null,
    });
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors = err.issues.map((e) => ({
      field: e.path.join('.'),
      message: e.message,
    }));
    res.status(400).json({
      status: 'error',
      message: 'Validation failed',
      data: errors,
    });
    return;
  }

  // JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    res.status(401).json({
      status: 'error',
      message: 'Invalid token',
      data: null,
    });
    return;
  }

  if (err instanceof jwt.TokenExpiredError) {
    res.status(401).json({
      status: 'error',
      message: 'Token has expired',
      data: null,
    });
    return;
  }

  // Default error
  res.status(500).json({
    status: 'error',
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    data: null,
  });
};
