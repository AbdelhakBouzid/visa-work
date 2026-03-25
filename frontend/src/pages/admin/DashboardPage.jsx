import { FileText, Layers3, PenSquare, Send } from 'lucide-react';
import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { adminApi } from '../../services/api';

const statCards = [
  { key: 'totalArticles', label: 'إجمالي المقالات', icon: FileText },
  { key: 'publishedArticles', label: 'المقالات المنشورة', icon: Send },
  { key: 'draftArticles', label: 'المسودات', icon: PenSquare },
  { key: 'totalCategories', label: 'إجمالي التصنيفات', icon: Layers3 }
];

function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi
      .getStats()
      .then((response) => setStats(response))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title="لوحة التحكم" description="إحصائيات وإدارة منصة visa-work." />
      <section>
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-700 dark:text-brand-300">لوحة التحكم</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950 dark:text-white">نظرة عامة على المحتوى</h1>
          <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
            راقب حالة المقالات والتصنيفات بسرعة، ثم انتقل مباشرة إلى الإدارة التفصيلية.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {statCards.map((card) => {
            const Icon = card.icon;
            return (
              <div key={card.key} className="surface-card p-6">
                <div className="inline-flex rounded-2xl bg-brand-50 p-3 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
                  <Icon className="h-5 w-5" />
                </div>
                <p className="mt-4 text-sm font-semibold text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="mt-3 text-4xl font-black text-slate-950 dark:text-white">{stats?.[card.key] || 0}</p>
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}

export default DashboardPage;
