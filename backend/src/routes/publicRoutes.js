import { Router } from 'express';
import { body } from 'express-validator';
import {
  getHomeData,
  submitContactForm,
  subscribeNewsletter
} from '../controllers/publicController.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/home', getHomeData);
router.post(
  '/contact',
  [
    body('name').isLength({ min: 2 }).withMessage('الاسم مطلوب.'),
    body('email').isEmail().withMessage('البريد الإلكتروني غير صالح.'),
    body('message').isLength({ min: 10 }).withMessage('يرجى كتابة رسالة أوضح.')
  ],
  validateRequest,
  submitContactForm
);
router.post(
  '/newsletter',
  [body('email').isEmail().withMessage('يرجى إدخال بريد إلكتروني صحيح.')],
  validateRequest,
  subscribeNewsletter
);

export default router;
