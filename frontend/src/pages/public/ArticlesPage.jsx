import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import Pagination from '../../components/common/Pagination';
import SearchBar from '../../components/common/SearchBar';
import SectionHeading from '../../components/common/SectionHeading';
import Seo from '../../components/common/Seo';
import { useSite } from '../../contexts/SiteContext';
import { publicApi } from '../../services/api';

function ArticlesPage() {
  const navigate = useNavigate();
  const { categories } = useSite();
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
      <Seo title="المقالات" description="جميع مقالات visa-work حول العمل بالخارج وتأشيرات العمل والهجرة القانونية." />

      <section className="page-shell py-14">
        <SectionHeading
          eyebrow="أرشيف المقالات"
          title="مكتبة عربية متخصصة في العمل بالخارج والتأشيرات"
          description="استعرض أحدث المقالات والأدلة العملية، أو قم بتصفية النتائج حسب التصنيف الذي يهمك."
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
                !category ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}
            >
              الكل
            </button>
            {categories.map((item) => (
              <button
                key={item._id}
                type="button"
                onClick={() => updateQuery(1, item.slug)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  category === item.slug ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {item.name}
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
            <h2 className="text-2xl font-bold text-slate-900">لا توجد مقالات حالياً</h2>
            <p className="mt-3 text-sm text-slate-600">
              جرّب تغيير التصنيف أو العودة إلى{' '}
              <Link to="/" className="font-semibold text-brand-700">
                الصفحة الرئيسية
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
