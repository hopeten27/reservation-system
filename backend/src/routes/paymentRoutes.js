import express from 'express';
import { createPaymentIntent, handleWebhook } from '../controllers/paymentController.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create-payment-intent', authGuard, createPaymentIntent);
router.post('/webhook', express.raw({ type: 'application/json' }), handleWebhook);

export default router;