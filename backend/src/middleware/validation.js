import { z } from 'zod';

export const validate = (schema) => {
  return (req, res, next) => {
    try {
      schema.parse(req.body);
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Validation failed',
          code: 'VALIDATION_ERROR',
          details: error.errors
        }
      });
    }
  };
};

// Zod schemas
export const userCreateSchema = z.object({
  name: z.string().min(2).max(50),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(['user', 'admin']).optional(),
  avatarUrl: z.string().url().optional()
});

export const userUpdateSchema = userCreateSchema.partial();

export const serviceCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().min(10),
  price: z.number().positive(),
  durationMinutes: z.number().positive(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional()
});

export const serviceUpdateSchema = serviceCreateSchema.partial();

export const slotCreateSchema = z.object({
  service: z.string().regex(/^[0-9a-fA-F]{24}$/),
  date: z.string().datetime(),
  capacity: z.number().positive().optional(),
  status: z.enum(['open', 'closed']).optional()
});

export const slotUpdateSchema = slotCreateSchema.partial();

export const bookingCreateSchema = z.object({
  service: z.string().regex(/^[0-9a-fA-F]{24}$/),
  slot: z.string().regex(/^[0-9a-fA-F]{24}$/),
  notes: z.string().optional()
});

export const bookingUpdateSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'cancelled', 'refunded']).optional(),
  notes: z.string().optional()
});