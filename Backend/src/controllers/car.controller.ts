import { Request, Response } from 'express';
import { carService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import ApiResponse from '../utils/response.js';
import type { CreateCarInput, UpdateCarInput } from '../schemas/car.schema.js';

export const carController = {
  /**
   * Create a new car profile
   * POST /api/v1/cars
   */
  create: asyncHandler(async (req: Request<{}, {}, CreateCarInput>, res: Response) => {
    const car = await carService.create(req.user!.id, req.body);
    return ApiResponse.created(res, car, 'Car profile created successfully');
  }),

  /**
   * Get all user's cars
   * GET /api/v1/cars
   */
  getAll: asyncHandler(async (req: Request, res: Response) => {
    const cars = await carService.findByUser(req.user!.id);
    return ApiResponse.success(res, cars);
  }),

  /**
   * Get a single car
   * GET /api/v1/cars/:id
   */
  getById: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    const car = await carService.findById(req.params.id, req.user!.id);
    return ApiResponse.success(res, car);
  }),

  /**
   * Update a car profile
   * PATCH /api/v1/cars/:id
   */
  update: asyncHandler(async (req: Request<{ id: string }, {}, UpdateCarInput>, res: Response) => {
    const car = await carService.update(req.params.id, req.user!.id, req.body);
    return ApiResponse.success(res, car, 'Car profile updated successfully');
  }),

  /**
   * Delete a car profile
   * DELETE /api/v1/cars/:id
   */
  delete: asyncHandler(async (req: Request<{ id: string }>, res: Response) => {
    await carService.delete(req.params.id, req.user!.id);
    return ApiResponse.success(res, null, 'Car profile deleted successfully');
  }),

  /**
   * Get all car brands
   * GET /api/v1/cars/brands
   */
  getBrands: asyncHandler(async (_req: Request, res: Response) => {
    const brands = await carService.getBrands();
    return ApiResponse.success(res, brands);
  }),

  /**
   * Get models by brand
   * GET /api/v1/cars/brands/:brandId/models
   */
  getModelsByBrand: asyncHandler(async (req: Request<{ brandId: string }>, res: Response) => {
    const models = await carService.getModelsByBrand(req.params.brandId);
    return ApiResponse.success(res, models);
  }),
};
