import express from 'express';
import { 
  bulkCreateSlots,
  exportData,
  getAnalytics,
  getUsers,
  updateUser,
  banUser
} from '../controllers/adminController.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes require admin role
router.use(authGuard, requireRole('admin'));

router.post('/bulk-slots', bulkCreateSlots);
router.post('/export', exportData);
router.get('/analytics', getAnalytics);
router.get('/users', getUsers);
router.put('/users/:id', updateUser);
router.put('/users/:id/ban', banUser);

export default router;