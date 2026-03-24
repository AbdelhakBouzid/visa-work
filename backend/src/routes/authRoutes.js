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
    body('name')
      .optional({ values: 'falsy' })
      .trim()
      .isLength({ min: 2 })
      .withMessage('اسم العرض قصير جداً.')
  ],
  validateRequest,
  initialSetup
);
router.post(
  '/login',
  [
    body('identifier').optional({ values: 'falsy' }).trim().isLength({ min: 3 }),
    body('email').optional({ values: 'falsy' }).trim().isLength({ min: 3 }),
    body().custom((value) => {
      if (!value.identifier && !value.email) {
        throw new Error('يرجى إدخال اسم المستخدم أو البريد الإلكتروني.');
      }

      return true;
    })
  ],
  validateRequest,
  login
);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
