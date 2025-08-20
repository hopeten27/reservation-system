import express from 'express';
import { 
  getServices, 
  getService, 
  createService, 
  updateService, 
  deleteService 
} from '../controllers/serviceController.js';
import { validate, serviceCreateSchema, serviceUpdateSchema } from '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(getServices)
  .post(validate(serviceCreateSchema), createService);

router.route('/:id')
  .get(getService)
  .put(validate(serviceUpdateSchema), updateService)
  .delete(deleteService);

export default router;