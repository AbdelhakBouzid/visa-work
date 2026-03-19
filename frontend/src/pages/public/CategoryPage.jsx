import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Pagination from '../../components/common/Pagination';
import Seo from '../../components/common/Seo';
import { useSite } from '../../contexts/SiteContext';
import { publicApi } from '../../services/api';

function CategoryPage() {
  const { slug } = useParams();
  const { categories } = useSite();
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

  return (
    <>
      <Seo
        title={category?.name || 'التصنيف'}
        description={category?.description || 'استعرض المقالات داخل هذا التصنيف.'}
      />
      <section className="page-shell py-14">
        <div className="rounded-[34px] bg-hero px-6 py-10 text-white shadow-soft md:px-10">
          <p className="text-sm font-semibold text-white/80">تصنيف</p>
          <h1 className="mt-3 text-4xl font-black">{category?.name || 'المقالات'}</h1>
          <p className="mt-4 max-w-3xl text-sm leading-8 text-white/80 md:text-base">
            {category?.description || 'استكشف المقالات المرتبطة بهذا التصنيف.'}
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
