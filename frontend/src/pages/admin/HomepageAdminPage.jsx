import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { adminApi, extractApiError, publicApi } from '../../services/api';

function HomepageAdminPage() {
  const [settings, setSettings] = useState(null);
  const [articles, setArticles] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    Promise.all([adminApi.getSettings(), adminApi.getArticles({ limit: 50, status: 'published' }), publicApi.getCategories()])
      .then(([settingsResponse, articlesResponse, categoriesResponse]) => {
        setSettings(settingsResponse.settings);
        setArticles(articlesResponse.items);
        setCategories(categoriesResponse.items);
      })
      .finally(() => setLoading(false));
  }, []);

  const toggleSelection = (field, value) => {
    setSettings((current) => {
      const exists = current.home[field].includes(value);
      return {
        ...current,
        home: {
          ...current.home,
          [field]: exists ? current.home[field].filter((item) => item !== value) : [...current.home[field], value]
        }
      };
    });
  };

  const handleSectionTitleChange = (key, value) => {
    setSettings((current) => ({
      ...current,
      home: {
        ...current.home,
        sectionTitles: {
          ...current.home.sectionTitles,
          [key]: value
        }
      }
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await adminApi.updateSettings({
        home: settings.home
      });
      setMessage('تم تحديث إعدادات الصفحة الرئيسية.');
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حفظ إعدادات الصفحة الرئيسية.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title="إدارة الرئيسية" description="إدارة نصوص الهيرو والمقالات المميزة والأقسام المبرزة." />
      <section>
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-700">الصفحة الرئيسية</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">تخصيص محتوى الصفحة الرئيسية</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6">
          <div className="surface-card p-6">
            <h2 className="text-xl font-bold text-slate-900">قسم الهيرو</h2>
            <div className="mt-5 grid gap-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">عنوان الهيرو</label>
                <input
                  value={settings.home.heroTitle}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      home: { ...current.home, heroTitle: event.target.value }
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">الوصف الفرعي</label>
                <textarea
                  rows={4}
                  value={settings.home.heroSubtitle}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      home: { ...current.home, heroSubtitle: event.target.value }
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">نص زر الهيرو</label>
                <input
                  value={settings.home.heroCtaText}
                  onChange={(event) =>
                    setSettings((current) => ({
                      ...current,
                      home: { ...current.home, heroCtaText: event.target.value }
                    }))
                  }
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <h2 className="text-xl font-bold text-slate-900">عناوين الأقسام</h2>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {Object.entries(settings.home.sectionTitles).map(([key, value]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">{key}</label>
                  <input
                    value={value}
                    onChange={(event) => handleSectionTitleChange(key, event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <div className="surface-card p-6">
              <h2 className="text-xl font-bold text-slate-900">المقالات المميزة</h2>
              <div className="mt-5 grid gap-3">
                {articles.map((article) => (
                  <label key={article._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-700">{article.title}</span>
                    <input
                      type="checkbox"
                      checked={settings.home.featuredArticleIds.includes(article._id)}
                      onChange={() => toggleSelection('featuredArticleIds', article._id)}
                    />
                  </label>
                ))}
              </div>
            </div>

            <div className="surface-card p-6">
              <h2 className="text-xl font-bold text-slate-900">التصنيفات المبرزة</h2>
              <div className="mt-5 grid gap-3">
                {categories.map((category) => (
                  <label key={category._id} className="flex items-center justify-between gap-3 rounded-2xl border border-slate-100 px-4 py-3">
                    <span className="text-sm text-slate-700">{category.name}</span>
                    <input
                      type="checkbox"
                      checked={settings.home.highlightedCategoryIds.includes(category._id)}
                      onChange={() => toggleSelection('highlightedCategoryIds', category._id)}
                    />
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="surface-card p-6">
            <button
              type="submit"
              disabled={saving}
              className="rounded-2xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {saving ? 'جارٍ الحفظ...' : 'حفظ إعدادات الرئيسية'}
            </button>
            {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
          </div>
        </form>
      </section>
    </>
  );
}

export default HomepageAdminPage;
