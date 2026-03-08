import { Router } from 'express';
import { commonController, dashboardController } from '../controllers/index.js';
import { authenticate, requireAdmin, validateBody, validateParams } from '../middleware/index.js';
import { createCitySchema, updateCitySchema, createBrandSchema, createModelSchema, idParamSchema } from '../schemas/index.js';

const router = Router();

// ============================================
// PUBLIC ROUTES
// ============================================

// Cities
router.get('/cities', commonController.getCities);
router.get('/cities/:id', validateParams(idParamSchema), commonController.getCityById);

// Brands & Models
router.get('/brands', commonController.getBrands);
router.get('/brands/:id', commonController.getBrandById);
router.get('/brands/:brandId/models', commonController.getModelsByBrand);

// ============================================
// PROTECTED ROUTES (User)
// ============================================

const protectedRouter = Router();
protectedRouter.use(authenticate);

// Favorites
protectedRouter.get('/favorites', commonController.getFavorites);
protectedRouter.post('/favorites/:vendorId', commonController.addFavorite);
protectedRouter.delete('/favorites/:vendorId', commonController.removeFavorite);

router.use(protectedRouter);

// ============================================
// ADMIN ROUTES
// ============================================

const adminRouter = Router();
adminRouter.use(authenticate);
adminRouter.use(requireAdmin);

// Cities management
adminRouter.post('/cities', validateBody(createCitySchema), commonController.createCity);
adminRouter.patch('/cities/:id', validateParams(idParamSchema), validateBody(updateCitySchema), commonController.updateCity);
adminRouter.delete('/cities/:id', validateParams(idParamSchema), commonController.deleteCity);

// Brands & Models management
adminRouter.post('/brands', validateBody(createBrandSchema), commonController.createBrand);
adminRouter.post('/models', validateBody(createModelSchema), commonController.createModel);

// Dashboard
adminRouter.get('/dashboard/stats', dashboardController.getStats);
adminRouter.get('/dashboard/recent-vendors', dashboardController.getRecentVendors);
adminRouter.get('/dashboard/top-cities', dashboardController.getTopCities);
adminRouter.get('/dashboard/vendors-by-category', dashboardController.getVendorsByCategory);
adminRouter.get('/dashboard/activity', dashboardController.getActivity);

router.use(adminRouter);

export default router;
