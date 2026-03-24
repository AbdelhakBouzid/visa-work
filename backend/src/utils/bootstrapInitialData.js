import { Category } from '../models/Category.js';
import { Settings } from '../models/Settings.js';
import { seedCategories } from '../seed/data.js';

const defaultSettingsPayload = (categories = []) => ({
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
    featuredArticleIds: [],
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

const ensureSettingsDocument = async (categories) => {
  const defaultSettings = defaultSettingsPayload(categories);
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

  if (!currentHome.featuredArticleIds?.length) {
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

export const bootstrapInitialData = async () => {
  const categories = await upsertSeedCategories();
  await ensureSettingsDocument(categories);

  return { categories: categories.length };
};
