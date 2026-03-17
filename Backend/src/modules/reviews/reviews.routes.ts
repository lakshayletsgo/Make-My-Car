import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { create, listByVendor } from './reviews.controller.js';

const reviewsRouter = Router();

reviewsRouter.get('/vendor/:vendorId', asyncHandler(listByVendor));
reviewsRouter.post('/', requireAuth, asyncHandler(create));

export default reviewsRouter;
