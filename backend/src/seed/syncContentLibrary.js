import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { Settings } from '../models/Settings.js';
import { User } from '../models/User.js';
import { ensureAdminAuthorRecord } from '../utils/adminSession.js';
import { homeSeedConfig, legacySeedSlugs, seedArticles, seedCategories } from './data.js';

const sortBySeedOrder = (items, sourceItems, getKey = (item) => item.slug) => {
  const order = new Map(sourceItems.map((item, index) => [getKey(item), index]));
  return [...items].sort((left, right) => (order.get(getKey(left)) ?? 0) - (order.get(getKey(right)) ?? 0));
};

export const upsertSeedCategories = async () => {
  const upserted = [];

  for (const category of seedCategories) {
    const saved = await Category.findOneAndUpdate(
      { slug: category.slug },
      { $set: category },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
    upserted.push(saved);
  }

  return sortBySeedOrder(upserted, seedCategories);
};

const buildFeaturedIds = (articles) => {
  const articleMap = new Map(articles.map((article) => [article.slug, article]));
  return homeSeedConfig.home.featuredArticleSlugs
    .map((slug) => articleMap.get(slug)?._id)
    .filter(Boolean);
};

const buildHighlightedCategoryIds = (categories) => {
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  return homeSeedConfig.home.highlightedCategorySlugs
    .map((slug) => categoryMap.get(slug)?._id)
    .filter(Boolean);
};

export const upsertSeedArticles = async ({ removeLegacySeed = false } = {}) => {
  const admin = await ensureAdminAuthorRecord();
  const categories = await Category.find({ slug: { $in: seedCategories.map((item) => item.slug) } });
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const existingArticles = await Article.find({
    slug: {
      $in: [...new Set([...seedArticles.map((item) => item.slug), ...legacySeedSlugs])]
    }
  });
  const existingBySlug = new Map(existingArticles.map((article) => [article.slug, article]));

  let created = 0;
  let updated = 0;

  for (const item of seedArticles) {
    const category = categoryMap.get(item.categorySlug);

    if (!category) {
      throw new Error(`Missing category for seed article: ${item.slug}`);
    }

    const existing = existingBySlug.get(item.slug);
    const payload = {
      title: item.title,
      slug: item.slug,
      excerpt: item.excerpt,
      content: item.content,
      featuredImage: existing?.featuredImage || item.featuredImage || '',
      category: category._id,
      tags: item.tags,
      status: item.status,
      seoTitle: item.seoTitle,
      seoDescription: item.seoDescription,
      author: existing?.author || admin._id,
      views: existing ? Math.max(existing.views || 0, item.views || 0) : item.views || 0,
      publishedAt:
        item.status === 'published'
          ? existing?.publishedAt || (item.publishedAt ? new Date(item.publishedAt) : new Date())
          : null
    };

    if (existing) {
      Object.assign(existing, payload);
      await existing.save();
      updated += 1;
      continue;
    }

    await Article.create(payload);
    created += 1;
  }

  let removedLegacy = 0;
  if (removeLegacySeed) {
    const librarySlugs = new Set(seedArticles.map((item) => item.slug));
    const slugsToRemove = legacySeedSlugs.filter((slug) => !librarySlugs.has(slug));

    if (slugsToRemove.length) {
      const result = await Article.deleteMany({ slug: { $in: slugsToRemove } });
      removedLegacy = result.deletedCount || 0;
    }
  }

  const syncedArticles = await Article.find({ slug: { $in: seedArticles.map((item) => item.slug) } });

  return {
    admin,
    created,
    updated,
    removedLegacy,
    articles: sortBySeedOrder(syncedArticles, seedArticles)
  };
};

export const ensureSettingsDocument = async ({
  categories,
  articles,
  forceHomepageCuration = false
} = {}) => {
  const allCategories = categories?.length ? categories : await Category.find();
  const articleList = articles?.length
    ? articles
    : await Article.find({ slug: { $in: homeSeedConfig.home.featuredArticleSlugs }, status: 'published' });

  const defaultHome = {
    heroTitle: homeSeedConfig.home.heroTitle,
    heroSubtitle: homeSeedConfig.home.heroSubtitle,
    heroCtaText: homeSeedConfig.home.heroCtaText,
    featuredArticleIds: buildFeaturedIds(articleList),
    highlightedCategoryIds: buildHighlightedCategoryIds(allCategories),
    sectionTitles: homeSeedConfig.home.sectionTitles
  };

  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({
      siteName: homeSeedConfig.siteName,
      siteDescription: homeSeedConfig.siteDescription,
      logo: '/logo.svg',
      footerText: homeSeedConfig.footerText,
      contactEmail: homeSeedConfig.contactEmail,
      socialLinks: homeSeedConfig.socialLinks,
      home: defaultHome
    });

    return settings;
  }

  let changed = false;
  const currentHome = settings.home?.toObject?.() || settings.home || {};
  const currentSectionTitles = currentHome.sectionTitles || {};
  const mergedSectionTitles = {
    ...defaultHome.sectionTitles,
    ...currentSectionTitles
  };

  if (!settings.siteName) {
    settings.siteName = homeSeedConfig.siteName;
    changed = true;
  }

  if (!settings.siteDescription) {
    settings.siteDescription = homeSeedConfig.siteDescription;
    changed = true;
  }

  if (!settings.logo) {
    settings.logo = '/logo.svg';
    changed = true;
  }

  if (!settings.footerText) {
    settings.footerText = homeSeedConfig.footerText;
    changed = true;
  }

  if (!settings.contactEmail) {
    settings.contactEmail = homeSeedConfig.contactEmail;
    changed = true;
  }

  const mergedSocialLinks = {
    ...homeSeedConfig.socialLinks,
    ...(settings.socialLinks?.toObject?.() || settings.socialLinks || {})
  };

  if (JSON.stringify(settings.socialLinks) !== JSON.stringify(mergedSocialLinks)) {
    settings.socialLinks = mergedSocialLinks;
    changed = true;
  }

  if (!currentHome.heroTitle) {
    currentHome.heroTitle = defaultHome.heroTitle;
    changed = true;
  }

  if (!currentHome.heroSubtitle) {
    currentHome.heroSubtitle = defaultHome.heroSubtitle;
    changed = true;
  }

  if (!currentHome.heroCtaText) {
    currentHome.heroCtaText = defaultHome.heroCtaText;
    changed = true;
  }

  if (forceHomepageCuration || !currentHome.highlightedCategoryIds?.length) {
    currentHome.highlightedCategoryIds = defaultHome.highlightedCategoryIds;
    changed = true;
  }

  if (forceHomepageCuration || !currentHome.featuredArticleIds?.length) {
    currentHome.featuredArticleIds = defaultHome.featuredArticleIds;
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

export const syncContentLibrary = async ({
  wipeCollections = false,
  resetUsers = false,
  includeArticles = true,
  removeLegacySeed = false,
  forceHomepageCuration = false
} = {}) => {
  if (wipeCollections) {
    await Promise.all([Article.deleteMany({}), Category.deleteMany({}), Settings.deleteMany({})]);

    if (resetUsers) {
      await User.deleteMany({});
    }
  }

  const categories = await upsertSeedCategories();
  let articleSync = {
    created: 0,
    updated: 0,
    removedLegacy: 0,
    articles: []
  };

  if (includeArticles) {
    articleSync = await upsertSeedArticles({ removeLegacySeed });
  }

  const settings = await ensureSettingsDocument({
    categories,
    articles: articleSync.articles,
    forceHomepageCuration
  });

  return {
    categories,
    settings,
    articleSync
  };
};
