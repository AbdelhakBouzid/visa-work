import {
  ArrowLeft,
  BriefcaseBusiness,
  CreditCard,
  FileBadge2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import ArticleListItem from '../../components/common/ArticleListItem';
import LoadingScreen from '../../components/common/LoadingScreen';
import NewsletterCard from '../../components/common/NewsletterCard';
import SearchBar from '../../components/common/SearchBar';
import SectionHeading from '../../components/common/SectionHeading';
import Seo from '../../components/common/Seo';
import { publicApi } from '../../services/api';

const featureCards = [
  {
    icon: BriefcaseBusiness,
    title: 'فرص العمل بالخارج',
    description: 'أدلة عملية لاختيار البلد والقطاع المناسب وتحسين فرص القبول.'
  },
  {
    icon: ShieldCheck,
    title: 'مسارات قانونية واضحة',
    description: 'شرح موثوق للتأشيرات، الإقامة، والانتقال القانوني خطوة بخطوة.'
  },
  {
    icon: FileBadge2,
    title: 'الوثائق المطلوبة',
    description: 'قوائم واضحة للملفات الرسمية مع نصائح الترتيب والترجمة والتصديق.'
  },
  {
    icon: CreditCard,
    title: 'طرق دفع الرسوم',
    description: 'مقارنات بين وسائل الدفع الإلكترونية وكيف تتجنب القنوات غير الرسمية.'
  }
];

function HomePage() {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    publicApi
      .getHome()
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  const settings = data?.settings;
  const latestArticles = data?.latestArticles || [];
  const featuredArticles = data?.featuredArticles || [];
  const popularArticles = data?.popularArticles || [];
  const highlightedCategories = data?.highlightedCategories || [];
  const categorySections = data?.categorySections || [];

  return (
    <>
      <Seo title={settings?.siteName} description={settings?.siteDescription} />

      <section className="hero-pattern bg-hero text-white">
        <div className="page-shell grid gap-8 py-16 md:grid-cols-[1.1fr_0.9fr] md:py-24">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white/90">
              <Sparkles className="h-4 w-4" />
              منصة عربية حديثة لدلائل العمل والتأشيرات
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              {settings?.home?.heroTitle || 'ابدأ رحلتك نحو العمل بالخارج بخطوات واضحة وموثوقة'}
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              {settings?.home?.heroSubtitle}
            </p>
            <div className="mt-8 max-w-2xl">
              <SearchBar onSubmit={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)} />
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/articles"
                className="rounded-full bg-accent-400 px-6 py-3 text-sm font-bold text-slate-950 transition hover:bg-accent-300"
              >
                {settings?.home?.heroCtaText || 'استكشف أحدث المقالات'}
              </Link>
              <Link
                to="/about"
                className="rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white transition hover:bg-white/15"
              >
                تعرّف على المنصة
              </Link>
            </div>
          </div>

          <div className="surface-card overflow-hidden bg-white/10 p-5 text-white">
            <div className="grid gap-4 md:grid-cols-2">
              {featureCards.map((card) => {
                const Icon = card.icon;
                return (
                  <div key={card.title} className="rounded-[26px] border border-white/10 bg-white/5 p-5">
                    <div className="inline-flex rounded-2xl bg-white/10 p-3">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold">{card.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-white/75">{card.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-16">
        <section>
          <SectionHeading
            eyebrow="تصنيفات رئيسية"
            title="ابدأ من القسم المناسب لهدفك"
            description="قسمنا المحتوى إلى مسارات عملية تساعدك على الانتقال بسرعة إلى ما تحتاجه: فرص العمل، التأشيرات، الوثائق، والدفع."
          />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {highlightedCategories.map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="surface-card group p-6 transition hover:-translate-y-1"
              >
                <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700">
                  <ArrowLeft className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-bold text-slate-900">{category.name}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600">{category.description}</p>
                <div className="mt-5 text-sm font-semibold text-brand-700">استعرض المقالات</div>
              </Link>
            ))}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading
            eyebrow="مختارات التحرير"
            title={settings?.home?.sectionTitles?.featured || 'مقالات مميزة'}
            description="أهم المقالات التي تمنحك صورة عملية عن فرص العمل الدولية، التأشيرات، والخطوات القانونية."
          />
          {featuredArticles[0] ? <ArticleCard article={featuredArticles[0]} featured /> : null}
          {featuredArticles.length > 1 ? (
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {featuredArticles.slice(1).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          ) : null}
        </section>

        <section className="mt-20">
          <SectionHeading
            eyebrow="آخر التحديثات"
            title={settings?.home?.sectionTitles?.latest || 'أحدث المقالات'}
            description="محتوى جديد يتم تحديثه باستمرار حول تأشيرات العمل، المستندات، ومسارات التقديم."
            action={
              <Link to="/articles" className="text-sm font-semibold text-brand-700 hover:text-brand-900">
                جميع المقالات
              </Link>
            }
          />
          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {latestArticles.slice(0, 6).map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <div className="grid gap-4">
              <SectionHeading title={settings?.home?.sectionTitles?.popular || 'الأكثر قراءة'} />
              {popularArticles.slice(0, 4).map((article) => (
                <ArticleListItem key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>

        {categorySections.map((section) => (
          <section key={section.key} className="mt-20">
            <SectionHeading
              eyebrow={section.category.name}
              title={section.title}
              description={section.category.description}
              action={
                <Link
                  to={`/category/${section.category.slug}`}
                  className="text-sm font-semibold text-brand-700 hover:text-brand-900"
                >
                  عرض المزيد
                </Link>
              }
            />
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
              {section.articles.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </section>
        ))}

        <section className="mt-20">
          <NewsletterCard />
        </section>
      </div>
    </>
  );
}

export default HomePage;
