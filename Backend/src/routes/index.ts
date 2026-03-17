import { Router } from 'express';
import healthRouter from './health.routes.js';
import authRouter from '../modules/auth/auth.routes.js';
import vendorsRouter from '../modules/vendors/vendors.routes.js';
import reviewsRouter from '../modules/reviews/reviews.routes.js';
import carsRouter from '../modules/cars/cars.routes.js';
import favoritesRouter from '../modules/favorites/favorites.routes.js';

const router = Router();

router.use(healthRouter);
router.use('/auth', authRouter);
router.use('/vendors', vendorsRouter);
router.use('/reviews', reviewsRouter);
router.use('/cars', carsRouter);
router.use('/favorites', favoritesRouter);

export default router;
