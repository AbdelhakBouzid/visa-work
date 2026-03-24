import mongoose from 'mongoose';
import { connectDB } from '../config/db.js';
import { Article } from '../models/Article.js';
import { Category } from '../models/Category.js';
import { Settings } from '../models/Settings.js';
import { User } from '../models/User.js';
import { seedArticles, seedCategories } from './data.js';
import { createSlug } from '../utils/createSlug.js';
import { loadEnv } from '../utils/loadEnv.js';

loadEnv();

const runSeed = async () => {
  await connectDB();

  await Promise.all([Article.deleteMany({}), Category.deleteMany({}), Settings.deleteMany({}), User.deleteMany({})]);

  const adminEmail = process.env.ADMIN_EMAIL || 'abdelhak26@visa-work.com';
  const admin = await User.create({
    name: 'مدير الموقع',
    username: (process.env.ADMIN_USERNAME || createSlug(adminEmail.split('@')[0], 'admin')).toLowerCase(),
    email: adminEmail,
    password: process.env.ADMIN_PASSWORD || 'ABDObzd@@2001',
    role: 'admin'
  });

  const categories = await Category.insertMany(seedCategories);
  const categoryMap = new Map(categories.map((category) => [category.slug, category]));

  const createdArticles = await Article.insertMany(
    seedArticles.map((article) => ({
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featuredImage: article.featuredImage,
      category: categoryMap.get(article.categorySlug)._id,
      tags: article.tags,
      status: article.status,
      seoTitle: article.seoTitle,
      seoDescription: article.seoDescription,
      author: admin._id,
      views: article.views,
      publishedAt: article.status === 'published' ? new Date() : null
    }))
  );

  const settings = await Settings.create({
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
      featuredArticleIds: createdArticles.slice(0, 3).map((article) => article._id),
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

  console.log('Seed completed successfully');
  console.log(`Admin username: ${admin.username}`);
  console.log(`Admin email: ${admin.email}`);
  console.log(`Admin password: ${process.env.ADMIN_PASSWORD || 'ABDObzd@@2001'}`);
  console.log(`Settings created: ${settings.siteName}`);

  await mongoose.connection.close();
};

runSeed().catch(async (error) => {
  console.error(error);
  await mongoose.connection.close();
  process.exit(1);
});
