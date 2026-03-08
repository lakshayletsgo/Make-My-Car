import { Request, Response } from 'express';
import { authService } from '../services/index.js';
import { asyncHandler } from '../middleware/index.js';
import ApiResponse from '../utils/response.js';
import type { 
  RegisterInput, 
  LoginInput, 
  RefreshTokenInput,
  UpdateProfileInput,
  ChangePasswordInput 
} from '../schemas/auth.schema.js';

export const authController = {
  /**
   * Register new user
   * POST /api/v1/auth/register
   */
  register: asyncHandler(async (req: Request<{}, {}, RegisterInput>, res: Response) => {
    const result = await authService.register(req.body);
    return ApiResponse.created(res, result, 'User registered successfully');
  }),

  /**
   * Login user
   * POST /api/v1/auth/login
   */
  login: asyncHandler(async (req: Request<{}, {}, LoginInput>, res: Response) => {
    const result = await authService.login(req.body);
    return ApiResponse.success(res, result, 'Login successful');
  }),

  /**
   * Refresh access token
   * POST /api/v1/auth/refresh
   */
  refresh: asyncHandler(async (req: Request<{}, {}, RefreshTokenInput>, res: Response) => {
    const tokens = await authService.refreshToken(req.body.refreshToken);
    return ApiResponse.success(res, tokens, 'Token refreshed successfully');
  }),

  /**
   * Logout user
   * POST /api/v1/auth/logout
   */
  logout: asyncHandler(async (req: Request<{}, {}, RefreshTokenInput>, res: Response) => {
    await authService.logout(req.body.refreshToken);
    return ApiResponse.success(res, null, 'Logged out successfully');
  }),

  /**
   * Logout from all devices
   * POST /api/v1/auth/logout-all
   */
  logoutAll: asyncHandler(async (req: Request, res: Response) => {
    await authService.logoutAll(req.user!.id);
    return ApiResponse.success(res, null, 'Logged out from all devices');
  }),

  /**
   * Get current user profile
   * GET /api/v1/auth/me
   */
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getProfile(req.user!.id);
    return ApiResponse.success(res, user);
  }),

  /**
   * Update user profile
   * PATCH /api/v1/auth/me
   */
  updateProfile: asyncHandler(async (req: Request<{}, {}, UpdateProfileInput>, res: Response) => {
    const user = await authService.updateProfile(req.user!.id, req.body);
    return ApiResponse.success(res, user, 'Profile updated successfully');
  }),

  /**
   * Change password
   * POST /api/v1/auth/change-password
   */
  changePassword: asyncHandler(async (req: Request<{}, {}, ChangePasswordInput>, res: Response) => {
    await authService.changePassword(req.user!.id, req.body);
    return ApiResponse.success(res, null, 'Password changed successfully');
  }),
};
