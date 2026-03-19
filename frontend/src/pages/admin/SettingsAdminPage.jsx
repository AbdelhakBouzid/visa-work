import { useEffect, useState } from 'react';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { adminApi, extractApiError } from '../../services/api';

function SettingsAdminPage() {
  const [form, setForm] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    adminApi
      .getSettings()
      .then((response) => setForm(response.settings))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name.startsWith('socialLinks.')) {
      const key = name.split('.')[1];
      setForm((current) => ({
        ...current,
        socialLinks: {
          ...current.socialLinks,
          [key]: value
        }
      }));
      return;
    }

    setForm((current) => ({ ...current, [name]: value }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      return;
    }

    try {
      const response = await adminApi.uploadImage(file);
      setForm((current) => ({ ...current, logo: response.url }));
      setMessage('تم رفع الشعار بنجاح.');
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر رفع الشعار.'));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setMessage('');

    try {
      await adminApi.updateSettings({
        siteName: form.siteName,
        siteDescription: form.siteDescription,
        logo: form.logo,
        footerText: form.footerText,
        contactEmail: form.contactEmail,
        socialLinks: form.socialLinks
      });
      setMessage('تم تحديث إعدادات الموقع بنجاح.');
    } catch (error) {
      setMessage(extractApiError(error, 'تعذر حفظ الإعدادات.'));
    } finally {
      setSaving(false);
    }
  };

  if (loading || !form) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Seo title="إعدادات الموقع" description="إدارة اسم الموقع والوصف والشعار وروابط التواصل." />
      <section>
        <div className="mb-8">
          <p className="text-sm font-semibold text-brand-700">إعدادات الموقع</p>
          <h1 className="mt-2 text-4xl font-black text-slate-950">بيانات العلامة والمعلومات العامة</h1>
        </div>

        <form onSubmit={handleSubmit} className="surface-card p-6">
          <div className="grid gap-5 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">اسم الموقع</label>
              <input
                name="siteName"
                value={form.siteName}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold text-slate-700">بريد التواصل</label>
              <input
                name="contactEmail"
                value={form.contactEmail}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">وصف الموقع</label>
              <textarea
                name="siteDescription"
                rows={3}
                value={form.siteDescription}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
            <div className="md:col-span-2">
              <label className="mb-2 block text-sm font-semibold text-slate-700">نص الفوتر</label>
              <textarea
                name="footerText"
                rows={3}
                value={form.footerText}
                onChange={handleChange}
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
              />
            </div>
          </div>

          <div className="mt-6 rounded-[28px] border border-slate-200 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-lg font-bold text-slate-900">الشعار</h2>
              <label className="cursor-pointer rounded-full bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-700">
                رفع الشعار
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
              </label>
            </div>
            <input
              name="logo"
              value={form.logo || ''}
              onChange={handleChange}
              className="mt-4 w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
            />
            {form.logo ? <img src={form.logo} alt="الشعار" className="mt-4 h-24 rounded-2xl object-contain" /> : null}
          </div>

          <div className="mt-6 grid gap-5 md:grid-cols-2">
            {['facebook', 'x', 'linkedin', 'youtube'].map((key) => (
              <div key={key}>
                <label className="mb-2 block text-sm font-semibold text-slate-700">{key}</label>
                <input
                  name={`socialLinks.${key}`}
                  value={form.socialLinks?.[key] || ''}
                  onChange={handleChange}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={saving}
            className="mt-8 rounded-2xl bg-brand-700 px-6 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
          >
            {saving ? 'جارٍ الحفظ...' : 'حفظ الإعدادات'}
          </button>

          {message ? <p className="mt-4 text-sm text-brand-700">{message}</p> : null}
        </form>
      </section>
    </>
  );
}

export default SettingsAdminPage;
