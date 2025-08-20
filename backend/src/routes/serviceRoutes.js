import express from 'express';
import { 
  getServices, 
  getService, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { validate, serviceCreateSchema, serviceUpdateSchema } from '../middleware/validation.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(authGuard, requireRole('admin'), validate(serviceCreateSchema), createService);

router.route('/:id')
  .get(getService)
  .put(authGuard, requireRole('admin'), validate(serviceUpdateSchema), updateService)
  .delete(authGuard, requireRole('admin'), deleteService);

export default router;