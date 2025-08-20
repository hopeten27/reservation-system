import express from 'express';
import { 
  getSlots, 
  getSlot, 
  createSlot, 
  updateSlot, 
  deleteSlot 
} from '../controllers/slotController.js';
import { validate, slotCreateSchema, slotUpdateSchema } from '../middleware/validation.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getSlots)
  .post(authGuard, requireRole('admin'), validate(slotCreateSchema), createSlot);

router.route('/:id')
  .get(getSlot)
  .put(authGuard, requireRole('admin'), validate(slotUpdateSchema), updateSlot)
  .delete(authGuard, requireRole('admin'), deleteSlot);

export default router;