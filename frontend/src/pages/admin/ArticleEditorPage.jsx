import { ImagePlus, Save } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import LoadingScreen from '../../components/common/LoadingScreen';
import RichTextEditor from '../../components/common/RichTextEditor';
import Seo from '../../components/common/Seo';
import { adminApi, extractApiError, publicApi } from '../../services/api';

const initialForm = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  featuredImage: '',
  category: '',
  tags: '',
  status: 'draft',
  seoTitle: '',
  seoDescription: ''
};

function ArticleEditorPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const requests = [publicApi.getCategories()];

    if (isEditMode) {
      requests.push(adminApi.getArticleById(id));
    }

    Promise.all(requests)
      .then(([categoriesResponse, articleResponse]) => {
        setCategories(categoriesResponse.items);

        if (articleResponse?.article) {
          const article = articleResponse.article;
          setForm({
            title: article.title || '',
            slug: article.slug || '',
            excerpt: article.excerpt || '',
            content: article.content || '',
            featuredImage: article.featuredImage || '',
            category: article.category?._id || '',
            tags: article.tags?.join(', ') || '',
            status: article.status || 'draft',
            seoTitle: article.seoTitle || '',
            seoDescription: article.seoDescription || ''
          });
        }
      })
      .finally(() => setLoading(false));
  }, [id, isEditMode]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    setUploading(true);
    setMessage('');

    try {
      const response = await adminApi.uploadImage(file);
      setForm((current) => ({ ...current, featuredImage: response.url }));
      setMessage('تم رفع الصورة بنجاح.');
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر رفع الصورة.'));
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      const payload = {
        ...form,
        tags: form.tags
          .split(',')
          .map((tag) => tag.trim())
          .filter(Boolean)
      };

      if (isEditMode) {
        await adminApi.updateArticle(id, payload);
      } else {
        await adminApi.createArticle(payload);
      }

      navigate('/admin/articles');
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حفظ المقال.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title={isEditMode ? 'تعديل المقال' : 'مقال جديد'} description="إنشاء أو تعديل مقال في visa-work." />
      <section>
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-semibold text-brand-700">{isEditMode ? 'تعديل المقال' : 'مقال جديد'}</p>
            <h1 className="mt-2 text-4xl font-black text-slate-950">
              {isEditMode ? 'تحرير المقال الحالي' : 'إنشاء مقال جديد'}
            </h1>
          </div>
          <Link to="/admin/articles" className="text-sm font-semibold text-slate-600 hover:text-slate-950">
            العودة إلى المقالات
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-6 xl:grid-cols-[1fr_340px]">
          <div className="space-y-6">
            <div className="surface-card p-6">
              <div className="grid gap-5 md:grid-cols-2">
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">عنوان المقال</label>
                  <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    required
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">الرابط المختصر (slug)</label>
                  <input
                    name="slug"
                    value={form.slug}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">التصنيف</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    required
                  >
                    <option value="">اختر تصنيفاً</option>
                    {categories.map((category) => (
                      <option key={category._id} value={category._id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className="mb-2 block text-sm font-semibold text-slate-700">الملخص</label>
                  <textarea
                    name="excerpt"
                    rows={4}
                    value={form.excerpt}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="surface-card p-6">
              <label className="mb-4 block text-sm font-semibold text-slate-700">محتوى المقال</label>
              <RichTextEditor value={form.content} onChange={(value) => setForm((current) => ({ ...current, content: value }))} />
            </div>

            <div className="surface-card p-6">
              <h2 className="text-xl font-bold text-slate-900">إعدادات SEO</h2>
              <div className="mt-5 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">عنوان SEO</label>
                  <input
                    name="seoTitle"
                    value={form.seoTitle}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">الوصف التعريفي</label>
                  <textarea
                    name="seoDescription"
                    rows={3}
                    value={form.seoDescription}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="surface-card p-6">
              <h2 className="text-lg font-bold text-slate-900">النشر والوسوم</h2>
              <div className="mt-5 grid gap-5">
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">حالة المقال</label>
                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  >
                    <option value="draft">مسودة</option>
                    <option value="published">منشور</option>
                  </select>
                </div>
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-700">الوسوم</label>
                  <input
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="ألمانيا, تأشيرة عمل, وثائق"
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                  />
                </div>
              </div>
            </div>

            <div className="surface-card p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-bold text-slate-900">الصورة الرئيسية</h2>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                  <ImagePlus className="h-4 w-4" />
                  {uploading ? 'جارٍ الرفع...' : 'رفع صورة'}
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              </div>
              <input
                name="featuredImage"
                value={form.featuredImage}
                onChange={handleChange}
                placeholder="/uploads/example.jpg"
                className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
              {form.featuredImage ? (
                <img
                  src={form.featuredImage}
                  alt="معاينة"
                  className="mt-4 h-48 w-full rounded-[26px] object-cover"
                />
              ) : null}
            </div>

            <div className="surface-card p-6">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
              >
                <Save className="h-4 w-4" />
                {saving ? 'جارٍ الحفظ...' : isEditMode ? 'حفظ التعديلات' : 'إنشاء المقال'}
              </button>
              {message ? <p className="mt-4 text-sm text-rose-600">{message}</p> : null}
            </div>
          </div>
        </form>
      </section>
    </>
  );
}

export default ArticleEditorPage;
