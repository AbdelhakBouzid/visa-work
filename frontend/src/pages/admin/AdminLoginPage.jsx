import { ArrowRight, ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { useAuth } from '../../contexts/AuthContext';
import { authApi } from '../../services/api';

const DEFAULT_ADMIN_USERNAME = (import.meta.env.VITE_ADMIN_USERNAME || 'abdelhak26').trim().toLowerCase();
const DEFAULT_ADMIN_PASSWORD = 'ABDObzd@@2001';

const normalizeUsername = (value) => value.trim().toLowerCase();

function AdminLoginPage() {
  const { login, completeInitialSetup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [needsSetup, setNeedsSetup] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({
    username: DEFAULT_ADMIN_USERNAME
  });
  const [setupForm, setSetupForm] = useState({
    name: 'Abdelhak',
    username: DEFAULT_ADMIN_USERNAME,
    password: DEFAULT_ADMIN_PASSWORD,
    confirmPassword: DEFAULT_ADMIN_PASSWORD
  });

  useEffect(() => {
    let active = true;

    // Optional setup-status lookup should never block login UI or show an initial error.
    authApi
      .getSetupStatus()
      .then((response) => {
        if (!active) {
          return;
        }

        const suggestedUsername = normalizeUsername(response.preferredUsername || DEFAULT_ADMIN_USERNAME);
        setNeedsSetup(response.needsSetup);
        setLoginForm({ username: suggestedUsername });
        setSetupForm((current) => ({
          ...current,
          username: suggestedUsername
        }));
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, []);

  const goToAdmin = () => {
    navigate(location.state?.from?.pathname || '/admin', { replace: true });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      if (needsSetup) {
        if (setupForm.password !== setupForm.confirmPassword) {
          throw new Error('تأكيد كلمة المرور غير مطابق.');
        }

        await completeInitialSetup({
          name: setupForm.name.trim(),
          username: normalizeUsername(setupForm.username),
          password: setupForm.password
        });
      } else {
        await login({
          identifier: normalizeUsername(loginForm.username)
        });
      }

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
        title={needsSetup ? 'إعداد المدير الأول' : 'تسجيل دخول الإدارة'}
        description="بوابة إدارة visa-work لتسجيل الدخول أو إعداد حساب المدير الأول."
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
                    <span>{needsSetup ? 'الإعداد الأولي' : 'دخول الإدارة'}</span>
                  </span>
                  <h1 className="mt-4 text-3xl font-black text-slate-950 sm:text-4xl">
                    {needsSetup ? 'أنشئ حساب المدير الأول' : 'سجل الدخول إلى لوحة التحكم'}
                  </h1>
                  <p className="mt-3 max-w-lg text-sm leading-7 text-slate-500">
                    {needsSetup
                      ? 'اختر اسم المستخدم وكلمة المرور التي تريد الاعتماد عليهما لاحقاً. هذه الخطوة تظهر مرة واحدة فقط.'
                      : 'تسجيل الدخول باسم المستخدم فقط. إذا أدخلت كلمة مرور فسيتم التحقق منها اختيارياً.'}
                  </p>
                </div>

                <div className="hidden rounded-3xl bg-slate-950 p-4 text-white sm:block">
                  <ShieldCheck className="h-6 w-6" />
                </div>
              </div>

              <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                {needsSetup ? (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">اسم العرض</span>
                      <input
                        type="text"
                        value={setupForm.name}
                        onChange={(event) => setSetupForm((current) => ({ ...current, name: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                        placeholder="مثال: Abdelhak"
                      />
                    </label>

                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">اسم المستخدم</span>
                      <input
                        type="text"
                        value={setupForm.username}
                        onChange={(event) => setSetupForm((current) => ({ ...current, username: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                        placeholder={`مثال: ${DEFAULT_ADMIN_USERNAME}`}
                      />
                    </label>

                    <div className="grid gap-5 sm:grid-cols-2">
                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">كلمة المرور</span>
                        <input
                          type="password"
                          value={setupForm.password}
                          onChange={(event) =>
                            setSetupForm((current) => ({ ...current, password: event.target.value }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                        />
                      </label>

                      <label className="block">
                        <span className="mb-2 block text-sm font-semibold text-slate-700">تأكيد كلمة المرور</span>
                        <input
                          type="password"
                          value={setupForm.confirmPassword}
                          onChange={(event) =>
                            setSetupForm((current) => ({ ...current, confirmPassword: event.target.value }))
                          }
                          className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                        />
                      </label>
                    </div>
                  </>
                ) : (
                  <>
                    <label className="block">
                      <span className="mb-2 block text-sm font-semibold text-slate-700">
                        اسم المستخدم
                      </span>
                      <input
                        type="text"
                        value={loginForm.username}
                        onChange={(event) => setLoginForm((current) => ({ ...current, username: event.target.value }))}
                        className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-brand-500 focus:bg-white"
                        placeholder={`مثال: ${DEFAULT_ADMIN_USERNAME}`}
                      />
                    </label>
                  </>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-slate-950 px-5 py-3.5 text-sm font-bold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting
                    ? needsSetup
                      ? 'جارٍ إنشاء الحساب...'
                      : 'جارٍ تسجيل الدخول...'
                    : needsSetup
                      ? 'حفظ حساب المدير'
                      : 'دخول لوحة الإدارة'}
                </button>

                {error ? (
                  <p className="rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                    {error}
                  </p>
                ) : null}
              </form>

              <div className="mt-6 rounded-2xl bg-slate-50 px-4 py-3 text-xs leading-6 text-slate-500">
                {needsSetup
                  ? 'بعد الحفظ سيتم حفظ اسم المستخدم وكلمة المرور في قاعدة البيانات، وبعدها ستستخدمهما لكل دخول لاحق.'
                  : 'يمكنك تسجيل الدخول باسم المستخدم فقط، وكلمة المرور اختيارية.'}
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default AdminLoginPage;
