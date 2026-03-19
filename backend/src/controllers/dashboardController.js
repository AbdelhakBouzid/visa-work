import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getDashboardStats = asyncHandler(async (req, res) => {
  const [totalArticles, publishedArticles, draftArticles, totalCategories] = await Promise.all([
    Article.countDocuments(),
    Article.countDocuments({ status: 'published' }),
    Article.countDocuments({ status: 'draft' }),
    Category.countDocuments()
  ]);

  res.json({
    totalArticles,
    publishedArticles,
    draftArticles,
    totalCategories
  });
});
