import express from 'express';
import { getDashboardStats } from '../controllers/dashboardController.js';
import { authGuard, requireRole } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/stats', authGuard, requireRole('admin'), getDashboardStats);

export default router;