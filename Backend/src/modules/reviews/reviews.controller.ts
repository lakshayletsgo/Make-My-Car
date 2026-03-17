import type { Request, Response } from 'express';
import { z } from 'zod';
import { ApiError } from '../../middleware/error.js';
import { createReviewSchema } from './reviews.validation.js';
import { createReview, listVendorReviews } from './reviews.service.js';

export async function create(req: Request, res: Response) {
  if (!req.user) {
    throw new ApiError('Unauthorized', 401);
  }

  const parsed = createReviewSchema.safeParse(req.body);
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await createReview({ ...parsed.data, userId: req.user.userId });
  res.status(201).json({ success: true, data });
}

export async function listByVendor(req: Request, res: Response) {
  const page = Number(req.query.page ?? 1);
  const limit = Number(req.query.limit ?? 10);
  const parsed = z.object({ page: z.number().int().positive(), limit: z.number().int().positive().max(50) }).safeParse({
    page,
    limit,
  });
  if (!parsed.success) {
    throw new ApiError(parsed.error.message, 400);
  }

  const data = await listVendorReviews(req.params.vendorId, parsed.data.page, parsed.data.limit);
  res.status(200).json({ success: true, data });
}
