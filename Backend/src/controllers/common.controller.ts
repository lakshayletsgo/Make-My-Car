import { Request, Response } from 'express';
import { commonService, dashboardService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import ApiResponse from '../utils/response.js';
import type { CreateCityInput, UpdateCityInput, CreateBrandInput, CreateModelInput } from '../schemas/common.schema.js';

export const commonController = {
  // ============================================
  // CITIES
  // ============================================

  /**
   * Get all cities
   * GET /api/v1/cities
   */
  getCities: asyncHandler(async (_req: Request, res: Response) => {
    const cities = await commonService.getCities();
    return ApiResponse.success(res, cities);
  }),

  /**
   * Get city by ID
   * GET /api/v1/cities/:id
   */
  getCityById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const city = await commonService.getCityById(req.params.id);
    return ApiResponse.success(res, city);
  }),

  /**
   * Create city (admin only)
   * POST /api/v1/cities
   */
  createCity: asyncHandler(async (req: Request<{}, {}, CreateCityInput>, res: Response) => {
    const city = await commonService.createCity(req.body);
    return ApiResponse.created(res, city, 'City created successfully');
  }),

  /**
   * Update city (admin only)
   * PATCH /api/v1/cities/:id
   */
  updateCity: asyncHandler(async (req: Request<{ id: string }, {}, UpdateCityInput>, res: Response) => {
    const city = await commonService.updateCity(req.params.id, req.body);
    return ApiResponse.success(res, city, 'City updated successfully');
  }),

  /**
   * Delete city (admin only)
   * DELETE /api/v1/cities/:id
   */
  deleteCity: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await commonService.deleteCity(req.params.id);
    return ApiResponse.success(res, null, 'City deleted successfully');
  }),

  // ============================================
  // BRANDS & MODELS
  // ============================================

  /**
   * Get all brands
   * GET /api/v1/brands
   */
  getBrands: asyncHandler(async (_req: Request, res: Response) => {
    const brands = await commonService.getBrands();
    return ApiResponse.success(res, brands);
  }),

  /**
   * Get brand by ID with models
   * GET /api/v1/brands/:id
   */
  getBrandById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const brand = await commonService.getBrandById(req.params.id);
    return ApiResponse.success(res, brand);
  }),

  /**
   * Create brand (admin only)
   * POST /api/v1/brands
   */
  createBrand: asyncHandler(async (req: Request<{}, {}, CreateBrandInput>, res: Response) => {
    const brand = await commonService.createBrand(req.body);
    return ApiResponse.created(res, brand, 'Brand created successfully');
  }),

  /**
   * Get models by brand
   * GET /api/v1/brands/:brandId/models
   */
  getModelsByBrand: asyncHandler(async (req: Request<{ brandId: string }>, res: Response) => {
    const models = await commonService.getModelsByBrand(req.params.brandId);
    return ApiResponse.success(res, models);
  }),

  /**
   * Create model (admin only)
   * POST /api/v1/models
   */
  createModel: asyncHandler(async (req: Request<{}, {}, CreateModelInput>, res: Response) => {
    const model = await commonService.createModel(req.body);
    return ApiResponse.created(res, model, 'Model created successfully');
  }),

  // ============================================
  // FAVORITES
  // ============================================

  /**
   * Add vendor to favorites
   * POST /api/v1/favorites/:vendorId
   */
  addFavorite: asyncHandler(async (req: Request<{ vendorId: string }>, res: Response) => {
    const favorite = await commonService.addFavorite(req.user!.id, req.params.vendorId);
    return ApiResponse.created(res, favorite, 'Added to favorites');
  }),

  /**
   * Remove vendor from favorites
   * DELETE /api/v1/favorites/:vendorId
   */
  removeFavorite: asyncHandler(async (req: Request<{ vendorId: string }>, res: Response) => {
    await commonService.removeFavorite(req.user!.id, req.params.vendorId);
    return ApiResponse.success(res, null, 'Removed from favorites');
  }),

  /**
   * Get user's favorites
   * GET /api/v1/favorites
   */
  getFavorites: asyncHandler(async (req: Request, res: Response) => {
    const favorites = await commonService.getFavorites(req.user!.id);
    return ApiResponse.success(res, favorites);
  }),
};

export const dashboardController = {
  /**
   * Get dashboard stats
   * GET /api/v1/dashboard/stats
   */
  getStats: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getStats();
    return ApiResponse.success(res, stats);
  }),

  /**
   * Get recent vendors
   * GET /api/v1/dashboard/recent-vendors
   */
  getRecentVendors: asyncHandler(async (req: Request<{}, {}, {}, { limit?: string }>, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const vendors = await dashboardService.getRecentVendors(limit);
    return ApiResponse.success(res, vendors);
  }),

  /**
   * Get top cities
   * GET /api/v1/dashboard/top-cities
   */
  getTopCities: asyncHandler(async (req: Request<{}, {}, {}, { limit?: string }>, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;
    const cities = await dashboardService.getTopCities(limit);
    return ApiResponse.success(res, cities);
  }),

  /**
   * Get vendors by category stats
   * GET /api/v1/dashboard/vendors-by-category
   */
  getVendorsByCategory: asyncHandler(async (_req: Request, res: Response) => {
    const stats = await dashboardService.getVendorsByCategory();
    return ApiResponse.success(res, stats);
  }),

  /**
   * Get recent activity
   * GET /api/v1/dashboard/activity
   */
  getActivity: asyncHandler(async (req: Request<{}, {}, {}, { limit?: string }>, res: Response) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const activity = await dashboardService.getRecentActivity(limit);
    return ApiResponse.success(res, activity);
  }),
};
