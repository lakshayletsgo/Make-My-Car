import { Request, Response } from 'express';
import { ReviewStatus } from '@prisma/client';
import { reviewService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import ApiResponse from '../utils/response.js';
import type { CreateReviewInput, UpdateReviewInput, ReviewQueryInput } from '../schemas/review.schema.js';

export const reviewController = {
  /**
   * Create a new review
   * POST /api/v1/reviews
   */
  create: asyncHandler(async (req: Request<{}, {}, CreateReviewInput>, res: Response) => {
    const review = await reviewService.create(req.user!.id, req.body);
    return ApiResponse.created(res, review, 'Review submitted successfully');
  }),

  /**
   * Get all reviews (admin)
   * GET /api/v1/reviews
   */
  getAll: asyncHandler(async (req: Request<{}, {}, {}, ReviewQueryInput>, res: Response) => {
    const { reviews, total, page, limit } = await reviewService.findAll(req.query);
    return ApiResponse.paginated(res, reviews, total, page, limit);
  }),

  /**
   * Get reviews for a vendor
   * GET /api/v1/reviews/vendor/:vendorId
   */
  getByVendor: asyncHandler(async (
    req: Request<{ vendorId: string }, {}, {}, { page?: string; limit?: string }>,
    res: Response
  ) => {
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const { reviews, total } = await reviewService.findByVendor(req.params.vendorId, page, limit);
    return ApiResponse.paginated(res, reviews, total, page, limit);
  }),

  /**
   * Get a single review
   * GET /api/v1/reviews/:id
   */
  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const review = await reviewService.findById(req.params.id);
    return ApiResponse.success(res, review);
  }),

  /**
   * Update a review
   * PATCH /api/v1/reviews/:id
   */
  update: asyncHandler(async (req: Request<{ id: string }, {}, UpdateReviewInput>, res: Response) => {
    const review = await reviewService.update(req.params.id, req.user!.id, req.body);
    return ApiResponse.success(res, review, 'Review updated successfully');
  }),

  /**
   * Delete a review
   * DELETE /api/v1/reviews/:id
   */
  delete: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const isAdmin = req.user!.role === 'ADMIN';
    await reviewService.delete(req.params.id, req.user!.id, isAdmin);
    return ApiResponse.success(res, null, 'Review deleted successfully');
  }),

  /**
   * Moderate review (admin only)
   * PATCH /api/v1/reviews/:id/moderate
   */
  moderate: asyncHandler(async (
    req: Request<{ id: string }, {}, { status: ReviewStatus }>,
    res: Response
  ) => {
    const review = await reviewService.moderate(req.params.id, req.body.status);
    return ApiResponse.success(res, review, 'Review moderated successfully');
  }),

  /**
   * Get user's own reviews
   * GET /api/v1/reviews/me
   */
  getMyReviews: asyncHandler(async (req: Request, res: Response) => {
    const { reviews, total, page, limit } = await reviewService.findAll({
      userId: req.user!.id,
      page: 1,
      limit: 50,
      sortBy: 'createdAt',
      sortOrder: 'desc',
    });
    return ApiResponse.paginated(res, reviews, total, page, limit);
  }),
};
