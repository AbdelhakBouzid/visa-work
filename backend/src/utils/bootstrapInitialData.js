import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { Settings } from '../models/Settings.js';
import { User } from '../models/User.js';
import { seedArticles, seedCategories } from '../seed/data.js';

const defaultSettingsPayload = (categories = [], articles = []) => ({
  siteName: 'visa-work',
  siteDescription: 'منصة عربية حديثة لمتابعة فرص العمل بالخارج وتأشيرات العمل والهجرة القانونية والوثائق المطلوبة.',
  footerText: 'visa-work - منصة عربية مهنية للمقالات والأدلة الخاصة بالعمل بالخارج.',
  contactEmail: 'contact@visa-work.com',
  socialLinks: {
    facebook: 'https://facebook.com',
    x: 'https://x.com',
    linkedin: 'https://linkedin.com',
    youtube: 'https://youtube.com'
  },
  home: {
    heroTitle: 'محتوى عربي موثوق لفهم فرص العمل والتأشيرات خطوة بخطوة',
    heroSubtitle:
      'نقدم لك مقالات عملية عن تأشيرات العمل، الهجرة القانونية، الوثائق المطلوبة، وطرق دفع رسوم التأشيرة.',
    heroCtaText: 'ابدأ من أحدث الأدلة',
    featuredArticleIds: articles.slice(0, 3).map((article) => article._id),
    highlightedCategoryIds: categories.slice(0, 4).map((category) => category._id),
    sectionTitles: {
      latest: 'أحدث المقالات',
      featured: 'مقالات مميزة',
      popular: 'الأكثر قراءة',
      workAbroad: 'مسارات العمل بالخارج',
      workVisa: 'أدلة تأشيرات العمل',
      immigration: 'الهجرة القانونية',
      visaPaymentMethods: 'دفع رسوم التأشيرة',
      requiredDocuments: 'الوثائق المطلوبة'
    }
  }
});

const upsertSeedCategories = async () => {
  for (const category of seedCategories) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      { $setOnInsert: category },
      { upsert: true, new: true }
    );
  }

  return Category.find().sort({ createdAt: 1 });
};

const ensureSettingsDocument = async (categories, articles = []) => {
  const defaultSettings = defaultSettingsPayload(categories, articles);
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create(defaultSettings);
    return settings;
  }

  let changed = false;
  const currentHome = settings.home?.toObject?.() || settings.home || {};
  const currentSectionTitles = currentHome.sectionTitles || {};
  const mergedSectionTitles = {
    ...defaultSettings.home.sectionTitles,
    ...currentSectionTitles
  };

  if (!currentHome.highlightedCategoryIds?.length && categories.length) {
    currentHome.highlightedCategoryIds = defaultSettings.home.highlightedCategoryIds;
    changed = true;
  }

  if (!currentHome.featuredArticleIds?.length && articles.length) {
    currentHome.featuredArticleIds = defaultSettings.home.featuredArticleIds;
    changed = true;
  }

  if (JSON.stringify(currentSectionTitles) !== JSON.stringify(mergedSectionTitles)) {
    currentHome.sectionTitles = mergedSectionTitles;
    changed = true;
  }

  if (changed) {
    settings.home = {
      ...currentHome
    };
    await settings.save();
  }

  return settings;
};

const ensureSeedArticles = async (author) => {
  const categories = await upsertSeedCategories();
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const articleCount = await Article.countDocuments();

  if (!articleCount && author) {
    await Article.insertMany(
      seedArticles.map((article) => ({
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        content: article.content,
        featuredImage: article.featuredImage,
        category: categoryMap.get(article.categorySlug)?._id,
        tags: article.tags,
        status: article.status,
        seoTitle: article.seoTitle,
        seoDescription: article.seoDescription,
        author: author._id,
        views: article.views,
        publishedAt: article.status === 'published' ? new Date() : null
      }))
    );
  }

  const publishedArticles = await Article.find({ status: 'published' }).sort({ createdAt: 1 });
  await ensureSettingsDocument(categories, publishedArticles);

  return { categories, publishedArticles };
};

const isSetupCompleteForUser = (user) =>
  Boolean(
    user &&
      user.role === 'admin' &&
      typeof user.username === 'string' &&
      user.username.trim() &&
      typeof user.password === 'string' &&
      user.password.trim() &&
      user.requiresSetup === false
  );

const findSetupCandidate = async () => {
  const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 });

  if (firstAdmin) {
    return firstAdmin;
  }

  return User.findOne().sort({ createdAt: 1 });
};

export const bootstrapInitialData = async () => {
  const categories = await upsertSeedCategories();
  await ensureSettingsDocument(categories, []);

  return { categories: categories.length };
};

export const getSetupStatus = async () => {
  const firstAdmin = await User.findOne({ role: 'admin' }).sort({ createdAt: 1 }).select(
    'username role requiresSetup password'
  );
  const setupComplete = isSetupCompleteForUser(firstAdmin);

  return {
    needsSetup: !setupComplete
  };
};

export const completeInitialAdminSetup = async ({ username, password }) => {
  const existingCompletedAdmin = await User.findOne({ role: 'admin', requiresSetup: false });
  if (existingCompletedAdmin) {
    const error = new Error('تم إعداد حساب المدير مسبقاً.');
    error.statusCode = 409;
    throw error;
  }

  const existingUser = await findSetupCandidate();
  const normalizedUsername = username.trim().toLowerCase();
  let user = existingUser;
  const usernameOwner = await User.findOne({ username: normalizedUsername });

  if (usernameOwner && (!existingUser || String(usernameOwner._id) !== String(existingUser._id))) {
    const error = new Error('اسم المستخدم مستخدم بالفعل.');
    error.statusCode = 409;
    throw error;
  }

  if (!existingUser) {
    user = await User.create({
      name: 'Admin',
      username: normalizedUsername,
      password,
      role: 'admin'
    });
  } else {
    user.username = normalizedUsername;
    user.password = password;
    user.role = 'admin';
    await user.save();
  }
  user.requiresSetup = false;
  await user.save();

  await ensureSeedArticles(user);

  return user;
};
