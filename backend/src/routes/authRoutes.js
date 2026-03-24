import { Router } from 'express';
import { body } from 'express-validator';
import { initialSetup, login, logout, me, setupStatus } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/setup-status', setupStatus);
router.post(
  '/setup',
  [
    body('username')
      .trim()
      .isLength({ min: 3, max: 30 })
      .withMessage('اسم المستخدم يجب أن يكون بين 3 و30 حرفاً.')
      .matches(/^[a-zA-Z0-9._-]+$/)
      .withMessage('اسم المستخدم يجب أن يحتوي على أحرف إنجليزية أو أرقام أو . أو _ أو -.'),
    body('password').isLength({ min: 8 }).withMessage('كلمة المرور يجب أن تكون 8 أحرف على الأقل.')
  ],
  validateRequest,
  initialSetup
);
router.post(
  '/login',
  [
    body('username').trim().isLength({ min: 3 }).withMessage('يرجى إدخال اسم المستخدم.'),
    body('password').isLength({ min: 1 }).withMessage('يرجى إدخال كلمة المرور.')
  ],
  validateRequest,
  login
);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
