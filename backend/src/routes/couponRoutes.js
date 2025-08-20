import express from 'express';
import { 
  validateCoupon, 
  applyCoupon, 
  getCoupons, 
  createCoupon 
} from '../controllers/couponController.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/validate', validateCoupon);
router.post('/apply', authGuard, applyCoupon);
router.get('/', authGuard, requireRole('admin'), getCoupons);
router.post('/', authGuard, requireRole('admin'), createCoupon);

export default router;