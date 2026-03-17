import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { getById, list } from './vendors.controller.js';

const vendorsRouter = Router();

vendorsRouter.get('/', asyncHandler(list));
vendorsRouter.get('/:id', asyncHandler(getById));

export default vendorsRouter;
