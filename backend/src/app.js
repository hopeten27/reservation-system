import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';

import errorHandler from './middleware/errorMiddleware.js';
import { authGuard, requireRole } from './middleware/authMiddleware.js';
import { compressionMiddleware } from './middleware/compression.js';
import { cacheMiddleware } from './middleware/cache.js';
import authRoutes from './routes/authRoutes.js';
import serviceRoutes from './routes/serviceRoutes.js';
import slotRoutes from './routes/slotRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import dashboardRoutes from './routes/dashboardRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import invoiceRoutes from './routes/invoiceRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import recurringRoutes from './routes/recurringRoutes.js';
import waitlistRoutes from './routes/waitlistRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

// Load environment variables
dotenv.config();

const app = express();

// Performance middleware
app.use(compressionMiddleware);

// Security middleware
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://your-frontend.vercel.app'] 
    : true,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED'
    }
  }
});
app.use('/api/', limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Logging
app.use(morgan('combined'));

// Health check
app.get('/api/v1/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'OK',
      timestamp: new Date().toISOString(),
      uptime: process.uptime()
    }
  });
});

// Routes with caching for read-only endpoints
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/services', cacheMiddleware(3 * 60 * 1000), serviceRoutes);
app.use('/api/v1/slots', cacheMiddleware(1 * 60 * 1000), slotRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/dashboard', dashboardRoutes);
app.use('/api/v1/payments', paymentRoutes);
app.use('/api/v1/invoices', invoiceRoutes);
app.use('/api/v1/reviews', reviewRoutes);
app.use('/api/v1/recurring', recurringRoutes);
app.use('/api/v1/waitlist', waitlistRoutes);
app.use('/api/v1/coupons', couponRoutes);
app.use('/api/v1/admin', adminRoutes);

// Protected test routes
app.get('/api/v1/protected', authGuard, (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Access granted to protected route',
      user: req.user.name
    }
  });
});

app.get('/api/v1/admin-only', authGuard, requireRole('admin'), (req, res) => {
  res.json({
    success: true,
    data: {
      message: 'Access granted to admin-only route',
      user: req.user.name
    }
  });
});

// 404 handler
app.all('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      message: `Route ${req.originalUrl} not found`,
      code: 'ROUTE_NOT_FOUND'
    }
  });
});

// Error handler
app.use(errorHandler);

export default app;