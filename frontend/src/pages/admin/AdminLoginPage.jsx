import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { useAuth } from '../../contexts/AuthContext';

const normalizeUsername = (value) => value.trim().toLowerCase();

function AdminLoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: '',
    password: ''
  });

  const goToAdmin = () => {
    navigate(location.state?.from?.pathname || '/admin', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      await login({
        username: normalizeUsername(form.username),
        password: form.password
      });
      goToAdmin();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Seo
        title="تسجيل دخول الإدارة"
        description="بوابة إدارة visa-work لتسجيل الدخول إلى لوحة التحكم."
      />

      <section className="min-h-screen bg-[radial-gradient(circle_at_top,#f7efe1,transparent_34%),linear-gradient(180deg,#f8fafc_0%,#eef2f7_100%)] px-4 py-8 sm:px-6">
        <div className="mx-auto flex min-h-[calc(100vh-4rem)] max-w-6xl flex-col">
          <div className="flex items-center justify-between py-4 text-slate-700">
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold shadow-sm transition hover:border-brand-300 hover:text-brand-700"
            >
              <ArrowRight className="h-4 w-4" />
              <span>العودة إلى الموقع</span>
            </Link>
            <div className="text-left">
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-brand-700">visa-work</p>
              <p className="mt-1 text-sm text-slate-500">بوابة إدارة المحتوى</p>
            </div>
          </div>

          <div className="flex flex-1 items-center justify-center py-8">
            <div className="w-full max-w-xl rounded-[32px] border border-white/60 bg-white/90 p-6 shadow-[0_30px_80px_rgba(15,23,42,0.12)] backdrop-blur sm:p-9">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-3 py-1 text-xs font-bold text-brand-700">
                    <ShieldCheck className="h-4 w-4" />
                    <span>دخول الإدارة</span>
                  </span>
                  <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                    سجل الدخول إلى لوحة التحكم
                  </h1>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                    هذا النظام يعتمد على بيانات الأدمن المعرفة مسبقاً في الخادم عبر ADMIN_USER و ADMIN_PASS،
                    وبعد نجاح الدخول يتم إنشاء Session Cookie آمنة تلقائياً.
                  </p>
                </div>

                <div className="hidden rounded-3xl bg-slate-950 p-4 text-white sm:block">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit} autoComplete="off" className="mt-8 space-y-5">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">اسم المستخدم</span>
                  <input
                    type="text"
                    value={form.username}
                    autoComplete="username"
                    onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                    placeholder="أدخل اسم المستخدم"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">كلمة المرور</span>
                  <input
                    type="password"
                    value={form.password}
                    autoComplete="current-password"
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                    placeholder="أدخل كلمة المرور"
                  />
                </label>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'جارٍ تسجيل الدخول...' : 'دخول لوحة الإدارة'}
                </button>

                {error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </p>
                ) : null}
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
                إذا لم يعمل الدخول، تحقق من متغيرات البيئة: `ADMIN_USER` و `ADMIN_PASS` و
                `ADMIN_SESSION_SECRET`.
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLoginPage;
