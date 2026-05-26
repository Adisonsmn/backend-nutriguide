import { describe, it, expect, vi, beforeEach } from 'vitest';
import { z } from 'zod';
import { validate } from '../../middlewares/validate.middleware';
import { Request, Response, NextFunction } from 'express';

describe('validate.middleware', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    req = {
      body: {},
    };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockImplementation(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = vi.fn();
  });

  const schema = z.object({
    username: z.string().min(3),
    email: z.string().email(),
  });

  it('should call next() if schema parsing succeeds', () => {
    req.body = {
      username: 'john_doe',
      email: 'john@example.com',
    };

    const middleware = validate(schema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });

  it('should return 400 with validation errors if parsing fails with ZodError', () => {
    req.body = {
      username: 'jo', // too short
      email: 'invalid-email', // invalid email
    };

    const middleware = validate(schema);
    middleware(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(400);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Validation failed',
      data: [
        { field: 'username', message: 'Too small: expected string to have >=3 characters' },
        { field: 'email', message: 'Invalid email address' },
      ],
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should call next(error) if parsing throws a non-ZodError', () => {
    const errorSchema = {
      parse: () => {
        throw new Error('Some internal error');
      },
    } as any;

    const middleware = validate(errorSchema);
    middleware(req as Request, res as Response, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    expect(statusMock).not.toHaveBeenCalled();
  });
});
