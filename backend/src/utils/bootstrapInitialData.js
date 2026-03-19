import { User } from '../models/User.js';
import { Category } from '../models/Category.js';
import { Article } from '../models/Article.js';
import { Settings } from '../models/Settings.js';
import { seedArticles, seedCategories } from '../seed/data.js';

const buildSettingsPayload = (categories, articles) => ({
  siteName: 'visa-work',
  siteDescription:
    'منصة عربية حديثة لمتابعة فرص العمل بالخارج وتأشيرات العمل والهجرة القانونية والوثائق المطلوبة.',
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

export const bootstrapInitialData = async () => {
  let admin = await User.findOne({
    email: (process.env.ADMIN_EMAIL || 'admin@visa-work.com').toLowerCase()
  });

  if (!admin) {
    admin = await User.create({
      name: 'مدير الموقع',
      email: process.env.ADMIN_EMAIL || 'admin@visa-work.com',
      password: process.env.ADMIN_PASSWORD || 'Admin@123456',
      role: 'admin'
    });
  }

  for (const category of seedCategories) {
    await Category.findOneAndUpdate(
      { slug: category.slug },
      {
        $setOnInsert: category
      },
      { upsert: true, new: true }
    );
  }

  const categories = await Category.find().sort({ createdAt: 1 });
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));
  const articleCount = await Article.countDocuments();

  if (!articleCount) {
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
        author: admin._id,
        views: article.views,
        publishedAt: article.status === 'published' ? new Date() : null
      }))
    );
  }

  const settings = await Settings.findOne();

  if (!settings) {
    const articles = await Article.find({ status: 'published' }).sort({ createdAt: 1 });
    await Settings.create(buildSettingsPayload(categories, articles));
  }

  return { adminCreated: !admin, categories: categories.length };
};
