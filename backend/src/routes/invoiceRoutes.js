import express from 'express';
import { generateInvoice, getInvoiceData } from '../controllers/invoiceController.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/:bookingId', authGuard, generateInvoice);
router.get('/:bookingId/data', authGuard, getInvoiceData);

export default router;