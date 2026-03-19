import { Plus, SquarePen, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { adminApi, extractApiError } from '../../services/api';
import { formatArabicDate } from '../../utils/formatters';

function ArticlesAdminPage() {
  const [data, setData] = useState({ items: [] });
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [message, setMessage] = useState('');

  const loadArticles = () => {
    setLoading(true);
    adminApi
      .getArticles({
        limit: 50,
        status: statusFilter
      })
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadArticles();
  }, [statusFilter]);

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('هل أنت متأكد من حذف هذا المقال؟');
    if (!shouldDelete) {
      return;
    }

    try {
      await adminApi.deleteArticle(id);
      setMessage('تم حذف المقال بنجاح.');
      loadArticles();
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حذف المقال.'));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title="إدارة المقالات" description="إدارة مقالات visa-work من لوحة التحكم." />
      <section>
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">إدارة المقالات</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">كل المقالات في مكان واحد</h1>
          </div>
          <Link
            to="/admin/articles/new"
            className="inline-flex items-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
          >
            <Plus className="h-4 w-4" />
            مقال جديد
          </Link>
        </div>

        <div className="surface-card p-5">
          <div className="mb-5 flex flex-wrap gap-3">
            {['all', 'published', 'draft'].map((status) => (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  statusFilter === status ? 'bg-brand-700 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {status === 'all' ? 'الكل' : status === 'published' ? 'منشور' : 'مسودة'}
              </button>
            ))}
          </div>

          {message ? <p className="mb-4 text-sm text-brand-700">{message}</p> : null}

          <div className="overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-semibold">العنوان</th>
                  <th className="px-4 py-3 font-semibold">التصنيف</th>
                  <th className="px-4 py-3 font-semibold">الحالة</th>
                  <th className="px-4 py-3 font-semibold">آخر تحديث</th>
                  <th className="px-4 py-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {data.items.map((article) => (
                  <tr key={article._id} className="border-b border-slate-100">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{article.title}</div>
                      <div className="mt-1 text-xs text-slate-500">{article.slug}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{article.category?.name || '-'}</td>
                    <td className="px-4 py-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          article.status === 'published'
                            ? 'bg-emerald-100 text-emerald-700'
                            : 'bg-amber-100 text-amber-700'
                        }`}
                      >
                        {article.status === 'published' ? 'منشور' : 'مسودة'}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{formatArabicDate(article.updatedAt)}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-3">
                        <Link
                          to={`/admin/articles/${article._id}/edit`}
                          className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
                        >
                          <SquarePen className="h-3.5 w-3.5" />
                          تعديل
                        </Link>
                        <button
                          type="button"
                          onClick={() => handleDelete(article._id)}
                          className="inline-flex items-center gap-2 rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          حذف
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

export default ArticlesAdminPage;
