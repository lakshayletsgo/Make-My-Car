import { z } from 'zod';

// ============================================
// REVIEW SCHEMAS
// ============================================

export const createReviewSchema = z.object({
  vendorId: z.string().cuid('Invalid vendor ID'),
  rating: z.number().int().min(1, 'Rating must be at least 1').max(5, 'Rating cannot exceed 5'),
  title: z.string().max(200).optional(),
  comment: z.string().min(10, 'Comment must be at least 10 characters').max(2000),
});

export const updateReviewSchema = z.object({
  rating: z.number().int().min(1).max(5).optional(),
  title: z.string().max(200).optional(),
  comment: z.string().min(10).max(2000).optional(),
});

export const reviewIdParamSchema = z.object({
  id: z.string().cuid('Invalid review ID'),
});

export const reviewQuerySchema = z.object({
  vendorId: z.string().optional(),
  userId: z.string().optional(),
  status: z.enum(['PENDING', 'APPROVED', 'REJECTED']).optional(),
  minRating: z.coerce.number().min(1).max(5).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['rating', 'createdAt']).default('createdAt'),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

// Type exports
export type CreateReviewInput = z.infer<typeof createReviewSchema>;
export type UpdateReviewInput = z.infer<typeof updateReviewSchema>;
export type ReviewQueryInput = z.infer<typeof reviewQuerySchema>;
