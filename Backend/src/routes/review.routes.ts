import { Router } from 'express';
import { reviewController } from '../controllers/index.js';
import { authenticate, requireAdmin, validateBody, validateQuery, validateParams } from '../middleware/index.js';
import { createReviewSchema, updateReviewSchema, reviewQuerySchema, reviewIdParamSchema } from '../schemas/index.js';

const router = Router();

// Public routes
router.get('/vendor/:vendorId', reviewController.getByVendor);

// Protected routes
router.use(authenticate);

router.post('/', validateBody(createReviewSchema), reviewController.create);
router.get('/me', reviewController.getMyReviews);
router.get('/:id', validateParams(reviewIdParamSchema), reviewController.getById);
router.patch('/:id', validateParams(reviewIdParamSchema), validateBody(updateReviewSchema), reviewController.update);
router.delete('/:id', validateParams(reviewIdParamSchema), reviewController.delete);

// Admin routes
router.get('/', requireAdmin, validateQuery(reviewQuerySchema), reviewController.getAll);
router.patch('/:id/moderate', requireAdmin, validateParams(reviewIdParamSchema), reviewController.moderate);

export default router;
