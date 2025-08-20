import express from 'express';
import { 
  createRecurringBooking, 
  getRecurringBookings, 
  processRecurringBooking 
} from '../controllers/recurringController.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authGuard, createRecurringBooking);
router.get('/', authGuard, getRecurringBookings);
router.post('/:id/process', authGuard, processRecurringBooking);

export default router;