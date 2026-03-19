import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createSlug } from '../utils/createSlug.js';

export const listCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ createdAt: 1 }).lean();
  const counts = await Article.aggregate([
    { $match: { status: 'published' } },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  const countMap = new Map(counts.map((item) => [String(item._id), item.count]));

  res.json({
    items: categories.map((category) => ({
      ...category,
      articleCount: countMap.get(String(category._id)) || 0
    }))
  });
});

export const createCategory = asyncHandler(async (req, res) => {
  const category = await Category.create({
    name: req.body.name,
    slug: createSlug(req.body.slug || req.body.name, 'category'),
    description: req.body.description || ''
  });

  res.status(201).json({
    message: 'تم إنشاء التصنيف بنجاح.',
    category
  });
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'التصنيف غير موجود.' });
  }

  category.name = req.body.name ?? category.name;
  category.slug = createSlug(req.body.slug || req.body.name || category.slug, 'category');
  category.description = req.body.description ?? category.description;

  await category.save();

  res.json({
    message: 'تم تحديث التصنيف بنجاح.',
    category
  });
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    return res.status(404).json({ message: 'التصنيف غير موجود.' });
  }

  const linkedArticles = await Article.countDocuments({ category: category._id });

  if (linkedArticles > 0) {
    return res.status(400).json({
      message: 'لا يمكن حذف هذا التصنيف لأنه مرتبط بمقالات موجودة.'
    });
  }

  await category.deleteOne();

  res.json({ message: 'تم حذف التصنيف بنجاح.' });
});
