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
import { upload, uploadFields } from '../config/cloudinary.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(authGuard, requireRole('admin'), uploadFields.fields([{ name: 'image', maxCount: 1 }, { name: 'additionalImages', maxCount: 5 }]), validate(serviceCreateSchema), createService);

router.route('/:id')
  .get(getService)
  .put(authGuard, requireRole('admin'), uploadFields.fields([{ name: 'image', maxCount: 1 }, { name: 'additionalImages', maxCount: 5 }]), validate(serviceUpdateSchema), updateService)
  .delete(authGuard, requireRole('admin'), deleteService);

export default router;