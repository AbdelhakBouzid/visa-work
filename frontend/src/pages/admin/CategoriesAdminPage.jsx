import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { adminApi, extractApiError, publicApi } from '../../services/api';

const initialForm = {
  name: '',
  slug: '',
  description: ''
};

function CategoriesAdminPage() {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState(initialForm);
  const [editingId, setEditingId] = useState('');
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  const loadCategories = () => {
    setLoading(true);
    publicApi
      .getCategories()
      .then((response) => setCategories(response.items))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCategories();
  }, []);

  const resetForm = () => {
    setForm(initialForm);
    setEditingId('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');

    try {
      if (editingId) {
        await adminApi.updateCategory(editingId, form);
        setMessage('تم تحديث التصنيف بنجاح.');
      } else {
        await adminApi.createCategory(form);
        setMessage('تم إنشاء التصنيف بنجاح.');
      }
      resetForm();
      loadCategories();
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حفظ التصنيف.'));
    }
  };

  const handleEdit = (category) => {
    setEditingId(category._id);
    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description || ''
    });
  };

  const handleDelete = async (id) => {
    const shouldDelete = window.confirm('هل تريد حذف هذا التصنيف؟');
    if (!shouldDelete) {
      return;
    }

    try {
      await adminApi.deleteCategory(id);
      setMessage('تم حذف التصنيف بنجاح.');
      loadCategories();
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حذف التصنيف.'));
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title="إدارة التصنيفات" description="إنشاء وتعديل وحذف تصنيفات visa-work." />
      <section className="grid gap-6 xl:grid-cols-[360px_1fr]">
        <form onSubmit={handleSubmit} className="surface-card p-6">
          <p className="text-sm font-semibold text-brand-700">
            {editingId ? 'تعديل التصنيف' : 'إضافة تصنيف جديد'}
          </p>
          <h1 className="mt-2 text-3xl font-black text-slate-950">إدارة التصنيفات</h1>
          <div className="mt-6 grid gap-5">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">اسم التصنيف</label>
              <input
                name="name"
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">الرابط المختصر</label>
              <input
                name="slug"
                value={form.slug}
                onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">الوصف</label>
              <textarea
                name="description"
                rows={4}
                value={form.description}
                onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            <button
              type="submit"
              className="rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800"
            >
              {editingId ? 'حفظ التعديلات' : 'إضافة التصنيف'}
            </button>
            {editingId ? (
              <button
                type="button"
                onClick={resetForm}
                className="rounded-2xl bg-slate-100 px-5 py-3 text-sm font-bold text-slate-700"
              >
                إلغاء
              </button>
            ) : null}
          </div>

          {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
        </form>

        <div className="surface-card p-6">
          <h2 className="text-2xl font-black text-slate-950">قائمة التصنيفات</h2>
          <div className="mt-6 overflow-x-auto">
            <table className="min-w-full text-right text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-slate-500">
                  <th className="px-4 py-3 font-semibold">الاسم</th>
                  <th className="px-4 py-3 font-semibold">الرابط</th>
                  <th className="px-4 py-3 font-semibold">عدد المقالات</th>
                  <th className="px-4 py-3 font-semibold">إجراءات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id} className="border-b border-slate-100">
                    <td className="px-4 py-4">
                      <div className="font-semibold text-slate-900">{category.name}</div>
                      <div className="mt-1 text-xs text-slate-500">{category.description}</div>
                    </td>
                    <td className="px-4 py-4 text-slate-600">{category.slug}</td>
                    <td className="px-4 py-4 text-slate-600">{category.articleCount || 0}</td>
                    <td className="px-4 py-4">
                      <div className="flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => handleEdit(category)}
                          className="rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700"
                        >
                          تعديل
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDelete(category._id)}
                          className="rounded-full bg-rose-50 px-4 py-2 text-xs font-semibold text-rose-700"
                        >
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

export default CategoriesAdminPage;
