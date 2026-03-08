import { Router, Request, Response } from 'express';
import authRoutes from './auth.routes.js';
import carRoutes from './car.routes.js';
import vendorRoutes from './vendor.routes.js';
import reviewRoutes from './review.routes.js';
import commonRoutes from './common.routes.js';

const router = Router();

// Health check
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    success: true,
    message: 'Make My Car API is running',
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
  });
});

// API routes
router.use('/auth', authRoutes);
router.use('/cars', carRoutes);
router.use('/vendors', vendorRoutes);
router.use('/reviews', reviewRoutes);
router.use('/', commonRoutes); // Cities, brands, favorites, dashboard

export default router;
