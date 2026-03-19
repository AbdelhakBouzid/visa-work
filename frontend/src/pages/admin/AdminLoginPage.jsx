import { ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { useAuth } from '../../contexts/AuthContext';

function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'admin@visa-work.com', password: 'Admin@123456' });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login(form);
      navigate(location.state?.from?.pathname || '/admin', { replace: true });
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo title="دخول الإدارة" description="تسجيل الدخول إلى لوحة إدارة visa-work." />
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-soft lg:grid-cols-[1fr_420px]">
          <div className="hidden bg-hero p-10 text-white lg:block">
            <div className="inline-flex rounded-2xl bg-white/10 p-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">إدارة المحتوى العربي الاحترافي من مكان واحد</h1>
            <p className="mt-5 text-sm leading-8 text-white/80">
              قم بإدارة المقالات، التصنيفات، إعدادات الموقع، ومحتوى الصفحة الرئيسية من لوحة عربية سريعة
              ومنظمة.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            <p className="text-sm font-semibold text-brand-700">visa-work Admin</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">تسجيل الدخول</h2>
            <p className="mt-3 text-sm text-slate-500">استخدم بريد المدير وكلمة المرور للوصول إلى لوحة التحكم.</p>

            <div className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">البريد الإلكتروني</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-700">كلمة المرور</label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting ? 'جارٍ تسجيل الدخول...' : 'دخول لوحة الإدارة'}
            </button>

            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}

export default AdminLoginPage;
