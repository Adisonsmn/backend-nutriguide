import { describe, it, expect, vi, beforeEach } from 'vitest';
import jwt from 'jsonwebtoken';
import { verifyToken, JwtPayload } from '../../middlewares/auth.middleware';
import { Request, Response, NextFunction } from 'express';

vi.mock('jsonwebtoken');

describe('auth.middleware - verifyToken', () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;
  let statusMock: any;
  let jsonMock: any;

  beforeEach(() => {
    process.env.JWT_SECRET = 'test-secret';
    req = {
      headers: {},
    };
    jsonMock = vi.fn();
    statusMock = vi.fn().mockImplementation(() => ({ json: jsonMock }));
    res = {
      status: statusMock,
      json: jsonMock,
    };
    next = vi.fn();
    vi.clearAllMocks();
  });

  it('should return 401 when Authorization header is missing', () => {
    verifyToken(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Access token is missing or invalid',
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when Authorization header does not start with Bearer', () => {
    req.headers = { authorization: 'Basic some-token' };

    verifyToken(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Access token is missing or invalid',
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token has expired', () => {
    req.headers = { authorization: 'Bearer expired-token' };
    
    // Force jwt.verify to throw TokenExpiredError
    const expiredError = new jwt.TokenExpiredError('jwt expired', new Date());
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw expiredError;
    });

    verifyToken(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Access token has expired',
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should return 401 when token is invalid', () => {
    req.headers = { authorization: 'Bearer invalid-token' };
    
    // Force jwt.verify to throw generic error
    vi.mocked(jwt.verify).mockImplementation(() => {
      throw new Error('invalid signature');
    });

    verifyToken(req as Request, res as Response, next);

    expect(statusMock).toHaveBeenCalledWith(401);
    expect(jsonMock).toHaveBeenCalledWith({
      status: 'error',
      message: 'Invalid access token',
      data: null,
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('should successfully verify token, populate req.user, and call next()', () => {
    req.headers = { authorization: 'Bearer valid-token' };
    
    const mockPayload: JwtPayload = {
      userId: 'USER-123',
      email: 'user@example.com',
    };
    
    vi.mocked(jwt.verify).mockReturnValue(mockPayload as any);

    verifyToken(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid-token', expect.any(String));
    expect(req.user).toEqual(mockPayload);
    expect(next).toHaveBeenCalled();
    expect(statusMock).not.toHaveBeenCalled();
  });
});
