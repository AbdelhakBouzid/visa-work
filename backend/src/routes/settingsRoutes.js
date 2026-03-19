import { Router } from 'express';
import { body } from 'express-validator';
import { getSettings, updateSettings } from '../controllers/settingsController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', optionalAuth, getSettings);
router.put(
  '/',
  requireAuth,
  [
    body('siteName').optional().isLength({ min: 2 }).withMessage('اسم الموقع قصير جداً.'),
    body('contactEmail').optional().isEmail().withMessage('بريد التواصل غير صالح.')
  ],
  validateRequest,
  updateSettings
);

export default router;
