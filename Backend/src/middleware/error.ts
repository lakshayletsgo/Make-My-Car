import { Request, Response, NextFunction } from 'express';
import { AppError, ValidationError } from '../utils/errors.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Log error
  logger.error(err.message, { stack: err.stack });

  // Handle known application errors
  if (err instanceof AppError) {
    const response: {
      success: boolean;
      error: string;
      errors?: Record<string, string[]>;
    } = {
      success: false,
      error: err.message,
    };

    // Include validation errors if present
    if (err instanceof ValidationError) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle Prisma errors
  if (err.constructor.name === 'PrismaClientKnownRequestError') {
    const prismaError = err as unknown as { code: string; meta?: { target?: string[] } };
    
    switch (prismaError.code) {
      case 'P2002':
        res.status(409).json({
          success: false,
          error: `Duplicate value for field: ${prismaError.meta?.target?.join(', ') || 'unknown'}`,
        });
        return;
      case 'P2025':
        res.status(404).json({
          success: false,
          error: 'Record not found',
        });
        return;
      default:
        break;
    }
  }

  // Handle unknown errors
  const isDev = config.env === 'development';
  
  res.status(500).json({
    success: false,
    error: isDev ? err.message : 'Internal server error',
    ...(isDev && { stack: err.stack }),
  });
};

/**
 * Handle 404 routes
 */
export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    error: `Route ${req.method} ${req.originalUrl} not found`,
  });
};

/**
 * Async handler wrapper to catch errors
 */
export const asyncHandler = <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
  fn: (req: Request<P, ResBody, ReqBody, ReqQuery>, res: Response, next: NextFunction) => Promise<any>
) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req as any, res, next)).catch(next);
  };
};
