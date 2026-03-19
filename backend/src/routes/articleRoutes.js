import { Router } from 'express';
import { body } from 'express-validator';
import {
  createArticle,
  deleteArticle,
  getArticleById,
  getArticleBySlug,
  listArticles,
  updateArticle
} from '../controllers/articleController.js';
import { optionalAuth, requireAuth } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = Router();

router.get('/', optionalAuth, listArticles);
router.get('/id/:id', requireAuth, getArticleById);
router.get('/:slug', optionalAuth, getArticleBySlug);
router.post(
  '/',
  requireAuth,
  [
    body('title').isLength({ min: 3 }).withMessage('العنوان قصير جداً.'),
    body('excerpt').isLength({ min: 10 }).withMessage('الملخص مطلوب ويجب أن يكون أوضح.'),
    body('content').isLength({ min: 20 }).withMessage('محتوى المقال مطلوب.'),
    body('category').notEmpty().withMessage('اختر تصنيفاً للمقال.')
  ],
  validateRequest,
  createArticle
);
router.put(
  '/:id',
  requireAuth,
  [
    body('title').optional().isLength({ min: 3 }).withMessage('العنوان قصير جداً.'),
    body('excerpt').optional().isLength({ min: 10 }).withMessage('الملخص قصير جداً.'),
    body('content').optional().isLength({ min: 20 }).withMessage('المحتوى قصير جداً.')
  ],
  validateRequest,
  updateArticle
);
router.delete('/:id', requireAuth, deleteArticle);

export default router;
