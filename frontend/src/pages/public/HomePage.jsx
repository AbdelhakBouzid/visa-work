import { ArrowLeft, ArrowRight, BriefcaseBusiness, FileBadge2, ShieldCheck, Sparkles } from 'lucide-react';
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
import { useUi } from '../../contexts/UiContext';
import { publicApi } from '../../services/api';
import { buildCategoryGroups } from '../../utils/navigation';
import { getLocalizedCategoryCopy } from '../../utils/i18n';

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
  const { locale, isRtl, t } = useUi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const categoryGroups = useMemo(() => buildCategoryGroups(categories, locale, t), [categories, locale]);
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;

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
  const logoSrc = '/logo.svg';
  const heroTitle = locale === 'ar' ? settings?.home?.heroTitle || t('home.heroTitle') : t('home.heroTitle');
  const heroSubtitle = locale === 'ar' ? settings?.home?.heroSubtitle || t('home.heroSubtitle') : t('home.heroSubtitle');
  const heroCta = locale === 'ar' ? settings?.home?.heroCtaText || t('home.heroCta') : t('home.heroCta');
  const featuredTitle =
    locale === 'ar' ? settings?.home?.sectionTitles?.featured || t('home.featuredTitle') : t('home.featuredTitle');
  const latestTitle =
    locale === 'ar' ? settings?.home?.sectionTitles?.latest || t('home.latestTitle') : t('home.latestTitle');
  const popularTitle =
    locale === 'ar' ? settings?.home?.sectionTitles?.popular || t('home.popularTitle') : t('home.popularTitle');

  return (
    <>
      <Seo title={settings?.siteName} description={locale === 'ar' ? settings?.siteDescription : t('meta.defaultDescription')} />

      <section className="hero-pattern text-white">
        <div className="page-shell py-16 md:py-24">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/20 bg-white/10 py-2 pl-2 pr-4 shadow-soft">
              <span className="rounded-full bg-white/95 p-1.5">
                <img src={logoSrc} alt={settings?.siteName || 'visa-work'} className="h-8 w-auto sm:h-10" />
              </span>
              <span className="text-sm font-semibold text-white/90">{t('home.heroBadge')}</span>
            </div>

            <h1 className="mt-6 text-4xl font-black leading-tight md:text-6xl">{heroTitle}</h1>

            <p className="mt-5 max-w-2xl text-base leading-8 text-white/80 md:text-lg">{heroSubtitle}</p>

            <div className="mt-8 max-w-2xl">
              <SearchBar onSubmit={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)} />
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/articles" className="brand-primary-button">
                {heroCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="page-shell py-16">
        <section>
          <SectionHeading eyebrow={t('home.pathsEyebrow')} title={t('home.pathsTitle')} />

          <div className="grid gap-5 lg:grid-cols-3">
            {categoryGroups.map((group) => {
              const Icon = groupIconMap[group.key] || Sparkles;
              const gradient = groupGradientMap[group.key] || 'from-brand-800 to-brand-500';

              return (
                <article key={group.key} className="surface-card overflow-hidden p-6">
                  <div className={`h-1 rounded-full bg-gradient-to-l ${gradient}`} />

                  <div className="mt-5 inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 ring-1 ring-brand-100 dark:bg-brand-500/10 dark:text-brand-200 dark:ring-brand-500/20">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-5 text-2xl font-bold text-slate-950 dark:text-white">{group.label}</h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{group.description}</p>

                  <div className="mt-5 grid gap-3">
                    {group.items.map((item) => (
                      <Link
                        key={item.slug}
                        to={item.href}
                        className="group/item flex items-start justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-4 transition hover:border-brand-100 hover:bg-brand-50 dark:border-slate-800 dark:bg-slate-900 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                      >
                        <div>
                          <p className="text-sm font-bold text-slate-900 transition group-hover/item:text-brand-700 dark:text-white dark:group-hover/item:text-brand-200">
                            {item.name}
                          </p>
                          <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                        </div>
                        <DirectionalArrow
                          className={`mt-1 h-4 w-4 flex-none text-slate-400 transition ${isRtl ? 'group-hover/item:-translate-x-1' : 'group-hover/item:translate-x-1'} group-hover/item:text-accent-500`}
                        />
                      </Link>
                    ))}
                  </div>

                  <Link
                    to={group.href}
                    className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 transition hover:text-brand-900 dark:text-brand-200 dark:hover:text-white"
                  >
                    {t('common.exploreLabel', { label: group.label })}
                    <DirectionalArrow className="h-4 w-4" />
                  </Link>
                </article>
              );
            })}
          </div>
        </section>

        <section className="mt-20">
          <SectionHeading eyebrow={t('home.featuredEyebrow')} title={featuredTitle} description={t('home.featuredDescription')} />
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
            eyebrow={t('home.latestEyebrow')}
            title={latestTitle}
            description={t('home.latestDescription')}
            action={
              <Link to="/articles" className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-200 dark:hover:text-white">
                {t('common.viewAllArticles')}
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
              <SectionHeading title={popularTitle} />
              {popularArticles.slice(0, 4).map((article) => (
                <ArticleListItem key={article._id} article={article} />
              ))}
            </div>
          </div>
        </section>

        {categorySections.map((section) => {
          const localizedCategory = getLocalizedCategoryCopy(locale, section.category.slug);
          const sectionEyebrow = locale === 'ar' ? section.category.name : localizedCategory.name;
          const sectionTitle = locale === 'ar' ? section.title : localizedCategory.name;
          const sectionDescription = locale === 'ar' ? section.category.description : localizedCategory.description;

          return (
            <section key={section.key} className="mt-20">
              <SectionHeading
                eyebrow={sectionEyebrow}
                title={sectionTitle}
                description={sectionDescription}
                action={
                  <Link
                    to={`/category/${section.category.slug}`}
                    className="text-sm font-semibold text-brand-700 hover:text-brand-900 dark:text-brand-200 dark:hover:text-white"
                  >
                    {t('common.viewMore')}
                  </Link>
                }
              />
              <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
                {section.articles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </section>
          );
        })}

        <section className="mt-20">
          <NewsletterCard />
        </section>
      </div>
    </>
  );
}

export default HomePage;
