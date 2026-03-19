import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { Settings } from '../models/Settings.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { mapPublicSettings } from '../utils/publicSettings.js';

const populateOptions = [
  { path: 'category', select: 'name slug description' },
  { path: 'author', select: 'name' }
];

export const getHomeData = asyncHandler(async (req, res) => {
  const settings = await Settings.findOne();
  const categories = await Category.find().sort({ createdAt: 1 }).lean();

  const [latestArticles, popularArticles] = await Promise.all([
    Article.find({ status: 'published' })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(6)
      .populate(populateOptions)
      .lean(),
    Article.find({ status: 'published' })
      .sort({ views: -1, publishedAt: -1 })
      .limit(6)
      .populate(populateOptions)
      .lean()
  ]);

  let featuredArticles = [];
  let highlightedCategories = categories.slice(0, 4);

  if (settings?.home?.featuredArticleIds?.length) {
    featuredArticles = await Article.find({
      _id: { $in: settings.home.featuredArticleIds },
      status: 'published'
    })
      .populate(populateOptions)
      .lean();
  }

  if (!featuredArticles.length) {
    featuredArticles = latestArticles.slice(0, 3);
  }

  if (settings?.home?.highlightedCategoryIds?.length) {
    highlightedCategories = categories.filter((category) =>
      settings.home.highlightedCategoryIds.some((id) => String(id) === String(category._id))
    );
  }

  const sectionSlugMap = [
    { key: 'workAbroad', slug: 'work-abroad' },
    { key: 'workVisa', slug: 'work-visa' },
    { key: 'immigration', slug: 'immigration' },
    { key: 'visaPaymentMethods', slug: 'visa-payment-methods' },
    { key: 'requiredDocuments', slug: 'required-documents' }
  ];

  const categorySections = await Promise.all(
    sectionSlugMap.map(async ({ key, slug }) => {
      const category = categories.find((item) => item.slug === slug);

      if (!category) {
        return null;
      }

      const articles = await Article.find({
        category: category._id,
        status: 'published'
      })
        .sort({ publishedAt: -1 })
        .limit(4)
        .populate(populateOptions)
        .lean();

      return {
        key,
        title: settings?.home?.sectionTitles?.[key] || category.name,
        category,
        articles
      };
    })
  );

  res.json({
    settings: mapPublicSettings(settings),
    latestArticles,
    featuredArticles,
    popularArticles,
    categories,
    highlightedCategories,
    categorySections: categorySections.filter(Boolean)
  });
});

export const submitContactForm = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  settings.contactMessages.push({
    name: req.body.name,
    email: req.body.email,
    message: req.body.message
  });

  await settings.save();

  res.status(201).json({
    message: 'تم استلام رسالتك بنجاح. سنعود إليك في أقرب وقت.'
  });
});

export const subscribeNewsletter = asyncHandler(async (req, res) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({});
  }

  if (!settings.newsletterEmails.includes(req.body.email)) {
    settings.newsletterEmails.push(req.body.email);
    await settings.save();
  }

  res.status(201).json({
    message: 'تم الاشتراك في النشرة البريدية بنجاح.'
  });
});
