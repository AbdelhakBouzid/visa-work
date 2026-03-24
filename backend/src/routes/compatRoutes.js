import { Router } from 'express';
import { body } from 'express-validator';
import { getHomeData } from '../controllers/publicController.js';
import { initialSetup, login, logout, me, setupStatus } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/home', getHomeData);
router.get('/setup-status', setupStatus);
router.post('/setup', initialSetup);
router.post(
  '/login',
  [
    body('username').trim().isLength({ min: 1 }).withMessage('يرجى إدخال اسم المستخدم.'),
    body('password').isLength({ min: 1 }).withMessage('يرجى إدخال كلمة المرور.')
  ],
  validateRequest,
  login
);
router.post('/logout', logout);
router.get('/me', requireAuth, me);

export default router;
