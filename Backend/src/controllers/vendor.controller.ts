import { Request, Response } from 'express';
import { vendorService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import ApiResponse from '../utils/response.js';
import prisma from '../utils/prisma.js';
import type { CreateVendorInput, UpdateVendorInput, VendorQueryInput } from '../schemas/vendor.schema.js';

export const vendorController = {
  /**
   * Create a new vendor
   * POST /api/v1/vendors
   */
  create: asyncHandler(async (req: Request<{}, {}, CreateVendorInput>, res: Response) => {
    const vendor = await vendorService.create(req.body);
    return ApiResponse.created(res, vendor, 'Vendor created successfully');
  }),

  /**
   * Get all vendors with filtering
   * GET /api/v1/vendors
   */
  getAll: asyncHandler(async (req: Request<{}, {}, {}, VendorQueryInput>, res: Response) => {
    const { vendors, total, page, limit } = await vendorService.findAll(req.query);

    // Log recommendation served
    await prisma.analytics.create({
      data: {
        type: 'RECOMMENDATION_SERVED',
        data: { count: vendors.length, filters: req.query },
      },
    });

    return ApiResponse.paginated(res, vendors, total, page, limit);
  }),

  /**
   * Get vendor by ID
   * GET /api/v1/vendors/:id
   */
  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const vendor = await vendorService.findById(req.params.id);
    return ApiResponse.success(res, vendor);
  }),

  /**
   * Get vendor by slug
   * GET /api/v1/vendors/slug/:slug
   */
  getBySlug: asyncHandler(async (req: Request<{ slug: string }>, res: Response) => {
    const vendor = await vendorService.findBySlug(req.params.slug);
    return ApiResponse.success(res, vendor);
  }),

  /**
   * Update vendor
   * PATCH /api/v1/vendors/:id
   */
  update: asyncHandler(async (req: Request<{ id: string }, {}, UpdateVendorInput>, res: Response) => {
    const vendor = await vendorService.update(req.params.id, req.body);
    return ApiResponse.success(res, vendor, 'Vendor updated successfully');
  }),

  /**
   * Delete vendor
   * DELETE /api/v1/vendors/:id
   */
  delete: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await vendorService.delete(req.params.id);
    return ApiResponse.success(res, null, 'Vendor deleted successfully');
  }),

  /**
   * Verify vendor (admin only)
   * PATCH /api/v1/vendors/:id/verify
   */
  verify: asyncHandler(async (req: Request<{ id: string }, {}, { verified: boolean }>, res: Response) => {
    const vendor = await vendorService.verify(req.params.id, req.body.verified);
    return ApiResponse.success(res, vendor, `Vendor ${req.body.verified ? 'verified' : 'unverified'} successfully`);
  }),

  /**
   * Get vendors by category
   * GET /api/v1/vendors/category/:category
   */
  getByCategory: asyncHandler(async (req: Request<{ category: string }>, res: Response) => {
    const vendors = await vendorService.findByCategory(req.params.category);
    return ApiResponse.success(res, vendors);
  }),

  /**
   * Get nearby vendors
   * GET /api/v1/vendors/nearby
   */
  getNearby: asyncHandler(async (
    req: Request<{}, {}, {}, { latitude: string; longitude: string; radius?: string }>,
    res: Response
  ) => {
    const { latitude, longitude, radius } = req.query;
    const vendors = await vendorService.findNearby(
      parseFloat(latitude),
      parseFloat(longitude),
      radius ? parseFloat(radius) : undefined
    );
    return ApiResponse.success(res, vendors);
  }),
};
