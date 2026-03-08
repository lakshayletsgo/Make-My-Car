import { Router } from 'express';
import { carController } from '../controllers/index.js';
import { authenticate, validateBody, validateParams } from '../middleware/index.js';
import { createCarSchema, updateCarSchema, carIdParamSchema } from '../schemas/index.js';

const router = Router();

// Public routes - brands and models
router.get('/brands', carController.getBrands);
router.get('/brands/:brandId/models', carController.getModelsByBrand);

// Protected routes - require authentication
router.use(authenticate);

router.post('/', validateBody(createCarSchema), carController.create);
router.get('/', carController.getAll);
router.get('/:id', validateParams(carIdParamSchema), carController.getById);
router.patch('/:id', validateParams(carIdParamSchema), validateBody(updateCarSchema), carController.update);
router.delete('/:id', validateParams(carIdParamSchema), carController.delete);

export default router;
