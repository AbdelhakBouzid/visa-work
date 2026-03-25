import {
  ArrowLeft,
  BriefcaseBusiness,
  CreditCard,
  FileBadge2,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import ArticleListItem from '../../components/common/ArticleListItem';
import LoadingScreen from '../../components/common/LoadingScreen';
import NewsletterCard from '../../components/common/NewsletterCard';
import SearchBar from '../../components/common/SearchBar';
import SectionHeading from '../../components/common/SectionHeading';
import Seo from '../../components/common/Seo';
import { useSite } from '../../contexts/SiteContext';
import { publicApi } from '../../services/api';
import { buildCategoryGroups } from '../../utils/navigation';

const featureCards = [
  {
    icon: BriefcaseBusiness,
    title: 'فرص العمل بالخارج',
    description: 'بوابة عملية لاختيار الوجهة المناسبة، تجهيز السيرة الذاتية، ورفع جاهزيتك للتقديم.'
  },
  {
    icon: ShieldCheck,
    title: 'تأشيرات ومسارات قانونية',
    description: 'شرح واضح لتأشيرات العمل، الإقامة، والهجرة القانونية خطوة بخطوة وبأسلوب مهني.'
  },
  {
    icon: FileBadge2,
    title: 'الوثائق المطلوبة',
    description: 'قوائم مرتبة للمستندات الأساسية مع نصائح الترجمة، التصديق، وتنظيم الملف الرسمي.'
  },
  {
    icon: CreditCard,
    title: 'دفع الرسوم بأمان',
    description: 'إرشادات لاختيار القنوات الرسمية والابتعاد عن الروابط غير الموثوقة عند دفع رسوم التأشيرة.'
  }
];

const heroHighlights = [
  { value: '3', label: 'بوابات رئيسية', description: 'تنقل أسرع بين العمل بالخارج والتأشيرات والأدلة.' },
  { value: '6', label: 'أقسام متخصصة', description: 'هيكل أوضح للمقالات والمسارات العملية.' },
  { value: '100%', label: 'واجهة منظمة', description: 'ألوان موحدة وتجربة أخف على الهاتف والكمبيوتر.' }
];

const groupIconMap = {
  'work-abroad': BriefcaseBusiness,
  visas: ShieldCheck,
  guides: FileBadge2
};

const groupGradientMap = {
  'work-abroad': 'from-brand-900 via-brand-700 to-brand-500',
  visas: 'from-brand-700 via-brand-600 to-accent-500',
  guides: 'from-accent-600 via-accent-500 to-accent-300'
};

function HomePage() {
  const navigate = useNavigate();
  const { categories } = useSite();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const categoryGroups = useMemo(() => buildCategoryGroups(categories), [categories]);

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
  const categorySections = data?.categorySections || [];
  const logoSrc = settings?.logo || '/visa-work-logo.svg';

  return (
    <>
      <Seo title={settings?.siteName} description={settings?.siteDescription} />

      <section className="hero-pattern text-white">
        <div className="page-shell grid gap-10 py-16 md:py-24 xl:grid-cols-[1.04fr_0.96fr]">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pl-2 pr-4 shadow-soft">
              <span className="rounded-full bg-white/95 p-1.5">
                <img src={logoSrc} alt={settings?.siteName || 'visa-work'} className="h-8 w-auto sm:h-10" />
              </span>
              <span className="text-sm font-semibold text-white/90">منصة عربية حديثة للعمل بالخارج والتأشيرات</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">
              {settings?.home?.heroTitle || 'ابدأ رحلتك نحو العمل بالخارج بخطوات واضحة وموثوقة'}
            </h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
              {settings?.home?.heroSubtitle ||
                'نقدم لك محتوى عملياً عن العمل بالخارج، تأشيرات العمل، الوثائق المطلوبة، وطرق دفع الرسوم عبر القنوات الرسمية.'}
            </p>

            <div className="mt-8 max-w-2xl">
              <SearchBar onSubmit={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/articles" className="brand-primary-button">
                {settings?.home?.heroCtaText || 'استكشف أحدث المقالات'}
              </Link>
              <Link to="/about" className="brand-outline-button">
                تعرّف على المنصة
              </Link>
            </div>

            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {heroHighlights.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[28px] border border-white/10 bg-white/10 px-5 py-4 backdrop-blur-sm"
                >
                  <p className="text-2xl font-black text-accent-200">{item.value}</p>
                  <p className="mt-2 text-sm font-semibold text-white">{item.label}</p>
                  <p className="mt-2 text-xs leading-6 text-white/70">{item.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="overflow-hidden rounded-[34px] border border-white/10 bg-slate-950/20 p-6 text-white shadow-soft backdrop-blur">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-xl">
                <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                  <Sparkles className="h-4 w-4 text-accent-200" />
                  واجهة منظمة بأسلوب SaaS حديث
                </span>
                <h2 className="mt-5 text-2xl font-bold md:text-3xl">انتقل مباشرة إلى المسار الذي تحتاجه</h2>
                <p className="mt-3 text-sm leading-7 text-white/80 md:text-base">
                  هيكل أكثر ترتيباً يربط بين فرص العمل، التأشيرات، والأدلة العملية ضمن تجربة واضحة ومتناسقة.
                </p>
              </div>

              <div className="rounded-full border border-white/10 bg-white/10 px-4 py-2 text-xs font-semibold text-white/80">
                3 مجموعات رئيسية
              </div>
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2">
              {featureCards.map((card) => {
                const Icon = card.icon;

                return (
                  <div
                    key={card.title}
                    className="rounded-[28px] border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition hover:bg-white/10"
                  >
                    <div className="inline-flex rounded-2xl bg-white/10 p-3 text-accent-200 ring-1 ring-white/10">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h2 className="mt-4 text-lg font-bold">{card.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-white/80">{card.description}</p>
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
            eyebrow="المسارات الأساسية"
            title="كل المحتوى أصبح منظماً في ثلاث بوابات واضحة"
            description="أعدنا ترتيب الأقسام لتصل بسرعة إلى العمل بالخارج، التأشيرات، أو الأدلة العملية دون ازدحام في التصفح."
          />

          <div className="grid gap-5 lg:grid-cols-3">
            {categoryGroups.map((group) => {
              const Icon = groupIconMap[group.key] || Sparkles;
              const gradient = groupGradientMap[group.key] || 'from-brand-800 to-brand-500';

              return (
                <article key={group.key} className="surface-card overflow-hidden p-6">
                  <div className={`h-1 rounded-full bg-gradient-to-l ${gradient}`} />

                  <div className="mt-5 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 ring-1 ring-brand-100">
                    <Icon className="h-5 w-5" />
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-3">
                    <h3 className="text-2xl font-bold text-slate-950">{group.label}</h3>
                    <span className="rounded-full bg-accent-50 px-3 py-1 text-xs font-bold text-accent-700">
                      {group.items.length} قسم
                    </span>
                  </div>

                  <p className="mt-3 text-sm leading-7 text-slate-600">{group.description}</p>

                  <div className="mt-5 grid gap-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        to={item.href}
                        className="group/item flex items-start justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4 transition hover:border-brand-100 hover:bg-brand-50"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 transition group-hover/item:text-brand-700">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-slate-500">{item.description}</p>
                        </div>
                        <ArrowLeft className="mt-1 h-4 w-4 flex-none text-slate-400 transition group-hover/item:-translate-x-1 group-hover/item:text-accent-500" />
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={group.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900"
                  >
                    استكشف {group.label}
                    <ArrowLeft className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
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
