import { SearchX } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import LoadingScreen from '../../components/common/LoadingScreen';
import SearchBar from '../../components/common/SearchBar';
import Seo from '../../components/common/Seo';
import { publicApi } from '../../services/api';

function SearchResultsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    publicApi
      .getArticles({
        search: query,
        limit: 12
      })
      .then((response) => setItems(response.items))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <>
      <Seo title={`نتائج البحث: ${query || 'بحث'}`} description="ابحث عن المقالات العربية حول العمل بالخارج والتأشيرات." />
      <section className="page-shell py-14">
        <div className="surface-card p-6 md:p-8">
          <h1 className="text-3xl font-black text-slate-950">نتائج البحث</h1>
          <p className="mt-3 text-sm text-slate-600">
            استخدم كلمات مفتاحية مثل: تأشيرة عمل، ألمانيا، الوثائق المطلوبة، رسوم التأشيرة.
          </p>
          <div className="mt-5 max-w-2xl">
            <SearchBar onSubmit={(value) => value && navigate(`/search?q=${encodeURIComponent(value)}`)} />
          </div>
        </div>

        {loading ? (
          <LoadingScreen />
        ) : items.length ? (
          <>
            <p className="mt-8 text-sm text-slate-500">تم العثور على {items.length} نتيجة لعبارة "{query}"</p>
            <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {items.map((article) => (
                <ArticleCard key={article._id} article={article} />
              ))}
            </div>
          </>
        ) : (
          <div className="surface-card mt-8 p-10 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
              <SearchX className="h-6 w-6" />
            </div>
            <h2 className="mt-4 text-2xl font-bold text-slate-900">لا توجد نتائج مطابقة</h2>
            <p className="mt-3 text-sm text-slate-600">
              حاول استخدام كلمات أكثر عمومية أو انتقل إلى المقالات الأكثر قراءة في الصفحة الرئيسية.
            </p>
          </div>
        )}
      </section>
    </>
  );
}

export default SearchResultsPage;
