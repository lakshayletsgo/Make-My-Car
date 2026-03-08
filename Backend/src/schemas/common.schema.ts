import { z } from 'zod';

// ============================================
// COMMON SCHEMAS
// ============================================

export const paginationSchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

export const idParamSchema = z.object({
  id: z.string().cuid('Invalid ID'),
});

export const searchQuerySchema = z.object({
  q: z.string().min(1).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});

// ============================================
// CITY SCHEMAS
// ============================================

export const createCitySchema = z.object({
  name: z.string().min(2, 'City name must be at least 2 characters').max(100),
  state: z.string().min(2, 'State name must be at least 2 characters').max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
});

export const updateCitySchema = createCitySchema.partial();

// ============================================
// CAR BRAND & MODEL SCHEMAS
// ============================================

export const createBrandSchema = z.object({
  name: z.string().min(2, 'Brand name must be at least 2 characters').max(100),
  logo: z.string().url().optional(),
});

export const createModelSchema = z.object({
  name: z.string().min(1, 'Model name is required').max(100),
  brandId: z.string().cuid('Invalid brand ID'),
});

// Type exports
export type PaginationInput = z.infer<typeof paginationSchema>;
export type SearchQueryInput = z.infer<typeof searchQuerySchema>;
export type CreateCityInput = z.infer<typeof createCitySchema>;
export type UpdateCityInput = z.infer<typeof updateCitySchema>;
export type CreateBrandInput = z.infer<typeof createBrandSchema>;
export type CreateModelInput = z.infer<typeof createModelSchema>;
