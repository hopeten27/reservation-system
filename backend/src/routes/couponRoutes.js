import express from 'express';
import { 
  validateCoupon, 
  applyCoupon, 
  getCoupons, 
  createCoupon,
  deleteCoupon 
} from '../controllers/couponController.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.post('/apply', authGuard, applyCoupon);
router.get('/', authGuard, requireRole('admin'), getCoupons);
router.post('/', authGuard, requireRole('admin'), createCoupon);
router.delete('/:id', authGuard, requireRole('admin'), deleteCoupon);

export default router;