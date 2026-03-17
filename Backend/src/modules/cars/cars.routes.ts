import { Router } from 'express';
import { asyncHandler } from '../../utils/async-handler.js';
import { requireAuth } from '../../middleware/auth.js';
import { create, listMine } from './cars.controller.js';

const carsRouter = Router();

carsRouter.get('/', requireAuth, asyncHandler(listMine));
carsRouter.post('/', requireAuth, asyncHandler(create));

export default carsRouter;
