import { Router } from 'express';
import { body } from 'express-validator';
import { login, logout, me } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.post(
  '/login',
  [
    body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح.'),
    body('password').isLength({ min: 6 }).withMessage('يجب أن تتكون كلمة المرور من 6 أحرف على الأقل.')
  ],
  validateRequest,
  login
);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
