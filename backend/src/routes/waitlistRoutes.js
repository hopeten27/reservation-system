import express from 'express';
import { 
  joinWaitlist, 
  getUserWaitlist, 
  getWaitlistStatus, 
  removeFromWaitlist, 
  notifyNextInWaitlist 
} from '../controllers/waitlistController.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', authGuard, joinWaitlist);
router.get('/', authGuard, getUserWaitlist);
router.get('/service/:serviceId', authGuard, getWaitlistStatus);
router.delete('/:id', authGuard, removeFromWaitlist);
router.post('/notify/:serviceId', authGuard, requireRole('admin'), notifyNextInWaitlist);

export default router;