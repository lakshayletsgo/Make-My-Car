import { z } from 'zod';

// ============================================
// VENDOR SCHEMAS
// ============================================

const vendorCategoryEnum = z.enum(['INSURANCE', 'ACCESSORIES', 'SAFETY', 'SERVICE']);

export const createVendorSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(200),
  description: z.string().min(10, 'Description must be at least 10 characters').max(2000),
  category: vendorCategoryEnum,
  priceRange: z.string().max(100),
  address: z.string().min(5, 'Address must be at least 5 characters').max(500),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  phone: z.string().optional(),
  email: z.string().email().optional(),
  website: z.string().url().optional(),
  image: z.string().url().optional(),
  gallery: z.array(z.string().url()).optional(),
  cityId: z.string().cuid('Invalid city ID'),
  products: z.array(z.string()).optional(),
});

export const updateVendorSchema = createVendorSchema.partial();

export const vendorQuerySchema = z.object({
  category: vendorCategoryEnum.optional(),
  cityId: z.string().optional(),
  minRating: z.coerce.number().min(0).max(5).optional(),
  maxDistance: z.coerce.number().positive().optional(),
  verified: z
    .string()
    .transform((val) => val === 'true')
    .optional(),
  search: z.string().optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
  sortBy: z.enum(['rating', 'reviewCount', 'name', 'createdAt']).optional(),
  sortOrder: z.enum(['asc', 'desc']).default('desc'),
});

export const vendorIdParamSchema = z.object({
  id: z.string().min(1, 'Vendor ID is required'),
});

export const vendorSlugParamSchema = z.object({
  slug: z.string().min(1, 'Vendor slug is required'),
});

// Type exports
export type CreateVendorInput = z.infer<typeof createVendorSchema>;
export type UpdateVendorInput = z.infer<typeof updateVendorSchema>;
export type VendorQueryInput = z.infer<typeof vendorQuerySchema>;
