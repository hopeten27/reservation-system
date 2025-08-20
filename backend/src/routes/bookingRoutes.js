import express from 'express';
import { 
  getBookings, 
  getBooking, 
  createBooking, 
  updateBooking, 
  cancelBooking 
} from '../controllers/bookingController.js';
import { validate, bookingCreateSchema, bookingUpdateSchema } from '../middleware/validation.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// All booking routes require authentication
router.use(authGuard);

router.route('/')
  .get(getBookings)
  .post(validate(bookingCreateSchema), createBooking);

router.route('/:id')
  .get(getBooking)
  .put(validate(bookingUpdateSchema), updateBooking);

router.patch('/:id/cancel', cancelBooking);

export default router;