import mongoose from 'mongoose';
import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { createSlug } from '../utils/createSlug.js';
import { sanitizeArticleContent } from '../utils/contentSanitizer.js';

const articlePopulate = [
  { path: 'category', select: 'name slug description' },
  { path: 'author', select: 'name email' }
];

const normalizeTags = (tags) => {
  if (Array.isArray(tags)) {
    return tags.map((tag) => tag.trim()).filter(Boolean);
  }

  if (typeof tags === 'string') {
    return tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean);
  }

  return [];
};

export const listArticles = asyncHandler(async (req, res) => {
  const page = Math.max(Number(req.query.page) || 1, 1);
  const limit = Math.min(Math.max(Number(req.query.limit) || 9, 1), 50);
  const search = req.query.search?.trim();
  const categorySlug = req.query.category?.trim();
  const requestedStatus = req.query.status?.trim();
  const sort = req.query.sort?.trim() || 'latest';
  const scope = req.query.scope?.trim();

  if (scope === 'admin' && !req.user) {
    return res.status(401).json({ message: 'الوصول إلى لوحة الإدارة يتطلب تسجيل الدخول.' });
  }

  const filter = {};

  if (scope !== 'admin') {
    filter.status = 'published';
  } else if (requestedStatus && requestedStatus !== 'all') {
    filter.status = requestedStatus;
  }

  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { excerpt: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } }
    ];
  }

  if (categorySlug) {
    const selectors = [{ slug: categorySlug }];

    if (mongoose.Types.ObjectId.isValid(categorySlug)) {
      selectors.push({ _id: categorySlug });
    }

    const category = await Category.findOne({ $or: selectors });

    if (category) {
      filter.category = category._id;
    } else {
      return res.json({
        items: [],
        pagination: {
          page,
          limit,
          total: 0,
          pages: 0
        }
      });
    }
  }

  const sortMap = {
    latest: { publishedAt: -1, createdAt: -1 },
    popular: { views: -1, publishedAt: -1 },
    updated: { updatedAt: -1 }
  };

  const [items, total] = await Promise.all([
    Article.find(filter)
      .populate(articlePopulate)
      .sort(sortMap[sort] || sortMap.latest)
      .skip((page - 1) * limit)
      .limit(limit)
      .lean(),
    Article.countDocuments(filter)
  ]);

  res.json({
    items,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit)
    }
  });
});

export const getArticleBySlug = asyncHandler(async (req, res) => {
  const scope = req.query.scope?.trim();
  const preview = req.query.preview === 'true';

  if (scope === 'admin' && !req.user) {
    return res.status(401).json({ message: 'الوصول إلى هذه المادة يتطلب صلاحية إدارية.' });
  }

  const filter = { slug: req.params.slug };

  if (scope !== 'admin') {
    filter.status = 'published';
  }

  const article = await Article.findOne(filter).populate(articlePopulate);

  if (!article) {
    return res.status(404).json({ message: 'المقال غير موجود.' });
  }

  if (!req.user && !preview) {
    article.views += 1;
    await article.save();
  }

  const relatedArticles = await Article.find({
    _id: { $ne: article._id },
    category: article.category._id,
    status: 'published'
  })
    .sort({ publishedAt: -1 })
    .limit(3)
    .populate(articlePopulate)
    .lean();

  res.json({
    article,
    relatedArticles
  });
});

export const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id).populate(articlePopulate);

  if (!article) {
    return res.status(404).json({ message: 'المقال غير موجود.' });
  }

  res.json({ article });
});

export const createArticle = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.body.category);

  if (!category) {
    return res.status(404).json({ message: 'التصنيف المحدد غير موجود.' });
  }

  const article = await Article.create({
    title: req.body.title,
    slug: createSlug(req.body.slug || req.body.title),
    excerpt: req.body.excerpt,
    content: sanitizeArticleContent(req.body.content),
    featuredImage: req.body.featuredImage || '',
    category: category._id,
    tags: normalizeTags(req.body.tags),
    status: req.body.status || 'draft',
    seoTitle: req.body.seoTitle || req.body.title,
    seoDescription: req.body.seoDescription || req.body.excerpt,
    author: req.user._id
  });

  const populatedArticle = await Article.findById(article._id).populate(articlePopulate);

  res.status(201).json({
    message: 'تم إنشاء المقال بنجاح.',
    article: populatedArticle
  });
});

export const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'المقال غير موجود.' });
  }

  if (req.body.category) {
    const category = await Category.findById(req.body.category);

    if (!category) {
      return res.status(404).json({ message: 'التصنيف المحدد غير موجود.' });
    }

    article.category = category._id;
  }

  article.title = req.body.title ?? article.title;
  article.slug = createSlug(req.body.slug || req.body.title || article.slug);
  article.excerpt = req.body.excerpt ?? article.excerpt;
  article.content = req.body.content ? sanitizeArticleContent(req.body.content) : article.content;
  article.featuredImage = req.body.featuredImage ?? article.featuredImage;
  article.tags = req.body.tags ? normalizeTags(req.body.tags) : article.tags;
  article.status = req.body.status ?? article.status;
  article.seoTitle = req.body.seoTitle ?? article.seoTitle;
  article.seoDescription = req.body.seoDescription ?? article.seoDescription;

  if (article.status === 'published' && !article.publishedAt) {
    article.publishedAt = new Date();
  }

  if (article.status === 'draft') {
    article.publishedAt = null;
  }

  await article.save();

  const populatedArticle = await Article.findById(article._id).populate(articlePopulate);

  res.json({
    message: 'تم تحديث المقال بنجاح.',
    article: populatedArticle
  });
});

export const deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (!article) {
    return res.status(404).json({ message: 'المقال غير موجود.' });
  }

  await article.deleteOne();

  res.json({ message: 'تم حذف المقال بنجاح.' });
});
