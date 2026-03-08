import { Router } from 'express';
import { vendorController } from '../controllers/index.js';
import { authenticate, requireAdmin, validateBody, validateQuery, validateParams } from '../middleware/index.js';
import { createVendorSchema, updateVendorSchema, vendorQuerySchema, vendorIdParamSchema, vendorSlugParamSchema } from '../schemas/index.js';

const router = Router();

// Public routes
router.get('/', validateQuery(vendorQuerySchema), vendorController.getAll);
router.get('/nearby', vendorController.getNearby);
router.get('/category/:category', vendorController.getByCategory);
router.get('/slug/:slug', validateParams(vendorSlugParamSchema), vendorController.getBySlug);
router.get('/:id', validateParams(vendorIdParamSchema), vendorController.getById);

// Admin routes
router.use(authenticate);
router.use(requireAdmin);

router.post('/', validateBody(createVendorSchema), vendorController.create);
router.patch('/:id', validateParams(vendorIdParamSchema), validateBody(updateVendorSchema), vendorController.update);
router.patch('/:id/verify', validateParams(vendorIdParamSchema), vendorController.verify);
router.delete('/:id', validateParams(vendorIdParamSchema), vendorController.delete);

export default router;
