import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import SectionHeading from '../../components/common/SectionHeading';
import Seo from '../../components/common/Seo';
import { useSite } from '../../contexts/SiteContext';
import { useUi } from '../../contexts/UiContext';
import { publicApi } from '../../services/api';
import { getLocalizedCategoryCopy } from '../../utils/i18n';

function ArticlesPage() {
  const navigate = useNavigate();
  const { categories } = useSite();
  const { locale, t } = useUi();
  const [searchParams, setSearchParams] = useSearchParams();
  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);

  const page = Number(searchParams.get('page') || 1);
  const category = searchParams.get('category') || '';

  useEffect(() => {
    setLoading(true);
    publicApi
      .getArticles({
        page,
        limit: 9,
        category: category || undefined
      })
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  }, [page, category]);

  const updateQuery = (nextPage, nextCategory = category) => {
    const next = new URLSearchParams();
    if (nextPage > 1) {
      next.set('page', String(nextPage));
    }
    if (nextCategory) {
      next.set('category', nextCategory);
    }
    setSearchParams(next);
  };

  return (
    <>
      <Seo title={t('pages.articles.title')} description={t('pages.articles.seoDescription')} />

      <section className="page-shell py-14">
        <SectionHeading
          eyebrow={t('pages.articles.eyebrow')}
          title={t('pages.articles.heading')}
          description={t('pages.articles.description')}
        />

        <div className="surface-card mb-8 grid gap-4 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <div className="max-w-xl">
            <SearchBar onSubmit={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)} compact />
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateQuery(1, '')}
              className={`rounded-full px-4 py-2 text-sm font-semibold ${
                !category
                  ? 'bg-brand-700 text-white dark:bg-brand-600'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
              }`}
            >
              {t('common.all')}
            </button>
            {categories.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => updateQuery(1, item.slug)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  category === item.slug
                    ? 'bg-brand-700 text-white dark:bg-brand-600'
                    : 'bg-slate-100 text-slate-600 dark:bg-slate-900 dark:text-slate-300'
                }`}
              >
                {locale === 'ar' ? item.name : getLocalizedCategoryCopy(locale, item.slug).name}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : data.items.length ? (
          <>
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination
              page={data.pagination.page}
              pages={data.pagination.pages}
              onChange={(nextPage) => updateQuery(nextPage)}
            />
          </>
        ) : (
          <div className="surface-card p-10 text-center">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{t('pages.articles.emptyTitle')}</h2>
            <p className="mt-3 text-sm text-slate-600 dark:text-slate-300">
              {t('pages.articles.emptyDescription')}{' '}
              <Link to="/" className="font-semibold text-brand-700 dark:text-brand-200">
                {t('pages.notFound.homeCta')}
              </Link>
              .
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default ArticlesPage;
