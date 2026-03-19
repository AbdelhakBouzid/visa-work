import { Router } from 'express';
import { body } from 'express-validator';
import {
  createCategory,
  deleteCategory,
  listCategories,
  updateCategory
} from '../controllers/categoryController.js';
import { requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', listCategories);
router.post(
  '/',
  requireAuth,
  [
    body('name').isLength({ min: 2 }).withMessage('اسم التصنيف مطلوب.'),
    body('description')
      .optional({ values: 'falsy' })
      .isLength({ min: 4 })
      .withMessage('أضف وصفاً أو اتركه فارغاً.')
  ],
  validateRequest,
  createCategory
);
router.put(
  '/:id',
  requireAuth,
  [
    body('name').optional().isLength({ min: 2 }).withMessage('اسم التصنيف قصير جداً.'),
    body('description')
      .optional({ values: 'falsy' })
      .isLength({ min: 4 })
      .withMessage('الوصف قصير جداً.')
  ],
  validateRequest,
  updateCategory
);
router.delete('/:id', requireAuth, deleteCategory);

export default router;
