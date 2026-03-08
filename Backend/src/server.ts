import { createApp } from './app.js';
import { config, validateEnv } from './config/index.js';
import { logger } from './utils/logger.js';
import prisma from './utils/prisma.js';

async function bootstrap() {
  try {
    // Validate environment variables
    validateEnv();

    // Test database connection
    await prisma.$connect();
    logger.info('✅ Database connected successfully');

    // Create Express app
    const app = createApp();

    // Start server
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server running on port ${config.port}`);
      logger.info(`📍 Environment: ${config.env}`);
      logger.info(`📚 API: http://localhost:${config.port}/api/${config.apiVersion}`);
      logger.info(`❤️  Health: http://localhost:${config.port}/api/${config.apiVersion}/health`);
    });

    // Graceful shutdown handlers
    const shutdown = async (signal: string) => {
      logger.info(`\n${signal} received. Starting graceful shutdown...`);
      
      server.close(async () => {
        logger.info('HTTP server closed');
        
        await prisma.$disconnect();
        logger.info('Database connection closed');
        
        process.exit(0);
      });

      // Force shutdown after 30 seconds
      setTimeout(() => {
        logger.error('Forced shutdown after timeout');
        process.exit(1);
      }, 30000);
    };

    process.on('SIGTERM', () => shutdown('SIGTERM'));
    process.on('SIGINT', () => shutdown('SIGINT'));

    // Handle unhandled rejections
    process.on('unhandledRejection', (reason, promise) => {
      logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
    });

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      logger.error('Uncaught Exception:', error);
      process.exit(1);
    });

  } catch (error) {
    logger.error('Failed to start server:', error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

bootstrap();
