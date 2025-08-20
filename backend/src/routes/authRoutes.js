import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { validate, userCreateSchema } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', validate(userCreateSchema), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;