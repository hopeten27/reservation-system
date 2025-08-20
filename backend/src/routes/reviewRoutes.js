import express from 'express';
import { 
  getServiceReviews, 
  createReview, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/service/:serviceId', getServiceReviews);
router.post('/', authGuard, createReview);
router.put('/:id', authGuard, updateReview);
router.delete('/:id', authGuard, deleteReview);

export default router;