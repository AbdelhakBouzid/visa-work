import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Pagination from '../../components/common/Pagination';
import Seo from '../../components/common/Seo';
import { useSite } from '../../contexts/SiteContext';
import { useUi } from '../../contexts/UiContext';
import { publicApi } from '../../services/api';
import { getLocalizedCategoryCopy } from '../../utils/i18n';

function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useSite();
  const { locale, t } = useUi();
  const [data, setData] = useState({ items: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setPage(1);
  }, [slug]);

  useEffect(() => {
    setLoading(true);
    publicApi
      .getArticles({
        category: slug,
        page,
        limit: 9
      })
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  }, [slug, page]);

  const category = useMemo(() => categories.find((item) => item.slug === slug), [categories, slug]);
  const localizedCategory = getLocalizedCategoryCopy(locale, slug);
  const categoryName = locale === 'ar' && category?.name ? category.name : localizedCategory.name;
  const categoryDescription =
    locale === 'ar' && category?.description ? category.description : localizedCategory.description;

  return (
    <>
      <Seo title={categoryName || t('pages.category.defaultTitle')} description={categoryDescription || t('pages.category.seoDescription')} />
      <section className="page-shell py-14">
        <div className="rounded-[34px] bg-hero px-6 py-10 text-white shadow-soft md:px-10">
          <p className="text-sm font-semibold text-white/80">{t('pages.category.label')}</p>
          <h1 className="mt-3 text-4xl font-black">{categoryName || t('pages.category.defaultHeading')}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/80 md:text-base">
            {categoryDescription || t('pages.category.defaultDescription')}
          </p>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : (
          <>
            <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {data.items.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
            <Pagination
              page={data.pagination.page}
              pages={data.pagination.pages}
              onChange={(nextPage) => setPage(nextPage)}
            />
          </>
        )}
      </section>
    </>
  );
}

export default CategoryPage;
