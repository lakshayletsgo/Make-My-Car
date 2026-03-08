import express, { Express } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { config } from './config/index.js';
import { errorHandler, notFoundHandler } from './middleware/index.js';
import routes from './routes/index.js';
import { logger } from './utils/logger.js';

export function createApp(): Express {
  const app = express();

  // ============================================
  // SECURITY MIDDLEWARE
  // ============================================

  // Helmet - security headers
  app.use(helmet());

  // CORS
  app.use(cors({
    origin: config.cors.origin,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  }));

  // Rate limiting
  const limiter = rateLimit({
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    message: {
      success: false,
      error: 'Too many requests, please try again later',
    },
    standardHeaders: true,
    legacyHeaders: false,
  });

  app.use('/api', limiter);

  // ============================================
  // PARSING MIDDLEWARE
  // ============================================

  // Compression
  app.use(compression());

  // Parse JSON bodies
  app.use(express.json({ limit: '10mb' }));

  // Parse URL-encoded bodies
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // ============================================
  // LOGGING
  // ============================================

  // Morgan HTTP logging
  if (config.env !== 'test') {
    app.use(morgan('combined', {
      stream: {
        write: (message: string) => logger.http(message.trim()),
      },
    }));
  }

  // ============================================
  // ROUTES
  // ============================================

  // API routes
  app.use(`/api/${config.apiVersion}`, routes);

  // Root endpoint
  app.get('/', (_req, res) => {
    res.json({
      success: true,
      message: 'Welcome to Make My Car API',
      version: config.apiVersion,
      docs: `/api/${config.apiVersion}/health`,
    });
  });

  // ============================================
  // ERROR HANDLING
  // ============================================

  // 404 handler
  app.use(notFoundHandler);

  // Global error handler
  app.use(errorHandler);

  return app;
}

export default createApp;
