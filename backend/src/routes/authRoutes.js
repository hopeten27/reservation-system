import express from 'express';
import rateLimit from 'express-rate-limit';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { validate, userCreateSchema, loginSchema } from '../middleware/validation.js';
import { authGuard } from '../middleware/authMiddleware.js';

const router = express.Router();

// Login rate limiting
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 login requests per windowMs
  message: {
    success: false,
    error: {
      message: 'Too many login attempts, please try again later',
      code: 'LOGIN_RATE_LIMIT'
    }
  },
  standardHeaders: true,
  legacyHeaders: false
});

router.post('/register', validate(userCreateSchema), register);
router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', authGuard, getMe);

export default router;