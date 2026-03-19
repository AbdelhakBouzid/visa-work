import { ShieldCheck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, extractApiError } from '../../services/api';

function AdminLoginPage() {
  const { login, completeInitialSetup } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [setupLoading, setSetupLoading] = useState(true);
  const [needsSetup, setNeedsSetup] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [loginForm, setLoginForm] = useState({ identifier: '', password: '' });
  const [setupForm, setSetupForm] = useState({
    name: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    let active = true;

    authApi
      .getSetupStatus()
      .then((response) => {
        if (!active) {
          return;
        }

        setNeedsSetup(response.needsSetup);
      })
      .catch((requestError) => {
        if (!active) {
          return;
        }

        setError(extractApiError(requestError, 'تعذر التحقق من حالة إعداد الإدارة.'));
      })
      .finally(() => {
        if (active) {
          setSetupLoading(false);
        }
      });

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
          username: setupForm.username.trim(),
          password: setupForm.password
        });
      } else {
        await login(loginForm);
      }

      goToAdmin();
    } catch (submitError) {
      setError(submitError.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (setupLoading) {
    return <LoadingScreen fullScreen label="جارٍ تجهيز بوابة الإدارة..." />;
  }

  return (
    <>
      <Seo
        title={needsSetup ? 'إعداد المدير الأول' : 'دخول الإدارة'}
        description="تسجيل الدخول إلى لوحة إدارة visa-work أو إنشاء حساب المدير الأول."
      />
      <section className="flex min-h-screen items-center justify-center bg-slate-950 px-4 py-10">
        <div className="grid w-full max-w-5xl overflow-hidden rounded-[36px] bg-white shadow-soft lg:grid-cols-[1fr_420px]">
          <div className="hidden bg-hero p-10 text-white lg:block">
            <div className="inline-flex rounded-2xl bg-white/10 p-4">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h1 className="mt-6 text-4xl font-black leading-tight">
              {needsSetup ? 'أنشئ حساب المدير الأول وابدأ إدارة المنصة' : 'إدارة المحتوى العربي الاحترافي من مكان واحد'}
            </h1>
            <p className="mt-5 text-sm leading-8 text-white/80">
              {needsSetup
                ? 'هذه الخطوة تظهر مرة واحدة فقط. اختر اسم المستخدم وكلمة المرور اللذين تريد الاعتماد عليهما لاحقاً، وسيتم حفظهما في قاعدة البيانات.'
                : 'قم بإدارة المقالات، التصنيفات، إعدادات الموقع، ومحتوى الصفحة الرئيسية من لوحة عربية سريعة ومنظمة.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="p-8 sm:p-10">
            <p className="text-sm font-semibold text-brand-700">visa-work Admin</p>
            <h2 className="mt-3 text-3xl font-black text-slate-950">
              {needsSetup ? 'إعداد المدير الأول' : 'تسجيل الدخول'}
            </h2>
            <p className="mt-3 text-sm text-slate-500">
              {needsSetup
                ? 'اختر بيانات الدخول التي تريد استخدامها للإدارة. بعد الحفظ لن يظهر هذا النموذج مرة أخرى.'
                : 'استخدم اسم المستخدم أو البريد الإلكتروني وكلمة المرور للوصول إلى لوحة التحكم.'}
            </p>

            <div className="mt-8 space-y-5">
              {needsSetup ? (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">اسم العرض</label>
                    <input
                      type="text"
                      value={setupForm.name}
                      onChange={(event) => setSetupForm((current) => ({ ...current, name: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                      placeholder="مثال: Abdelhak"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">اسم المستخدم</label>
                    <input
                      type="text"
                      value={setupForm.username}
                      onChange={(event) => setSetupForm((current) => ({ ...current, username: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                      placeholder="مثال: abdelhak_admin"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">كلمة المرور</label>
                    <input
                      type="password"
                      value={setupForm.password}
                      onChange={(event) => setSetupForm((current) => ({ ...current, password: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">تأكيد كلمة المرور</label>
                    <input
                      type="password"
                      value={setupForm.confirmPassword}
                      onChange={(event) =>
                        setSetupForm((current) => ({ ...current, confirmPassword: event.target.value }))
                      }
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      اسم المستخدم أو البريد الإلكتروني
                    </label>
                    <input
                      type="text"
                      value={loginForm.identifier}
                      onChange={(event) => setLoginForm((current) => ({ ...current, identifier: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    />
                  </div>
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">كلمة المرور</label>
                    <input
                      type="password"
                      value={loginForm.password}
                      onChange={(event) => setLoginForm((current) => ({ ...current, password: event.target.value }))}
                      className="w-full rounded-2xl border border-slate-200 px-4 py-3 outline-none transition focus:border-brand-500"
                    />
                  </div>
                </>
              )}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="mt-8 w-full rounded-2xl bg-brand-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:opacity-60"
            >
              {submitting
                ? needsSetup
                  ? 'جارٍ إنشاء الحساب...'
                  : 'جارٍ تسجيل الدخول...'
                : needsSetup
                  ? 'حفظ حساب المدير'
                  : 'دخول لوحة الإدارة'}
            </button>

            {error ? <p className="mt-4 text-sm text-rose-600">{error}</p> : null}
          </form>
        </div>
      </section>
    </>
  );
}

export default AdminLoginPage;
