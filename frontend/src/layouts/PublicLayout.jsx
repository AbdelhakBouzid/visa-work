import { Globe2, Menu, Search, ShieldCheck } from 'lucide-react';
import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { useSite } from '../contexts/SiteContext';

const navigation = [
  { label: 'الرئيسية', to: '/' },
  { label: 'المقالات', to: '/articles' },
  { label: 'من نحن', to: '/about' },
  { label: 'اتصل بنا', to: '/contact' },
  { label: 'سياسة الخصوصية', to: '/privacy' }
];

function PublicLayout() {
  const navigate = useNavigate();
  const { settings, categories } = useSite();
  const [isOpen, setIsOpen] = useState(false);

  const handleSearch = (value) => {
    if (!value) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
    setIsOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-40 border-b border-white/40 bg-slate-50/90 backdrop-blur">
        <div className="page-shell py-4">
          <div className="flex items-center justify-between gap-4">
            <button
              type="button"
              onClick={() => setIsOpen((current) => !current)}
              className="inline-flex rounded-2xl border border-slate-200 bg-white p-3 text-slate-700 lg:hidden"
              aria-label="فتح القائمة"
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link to="/" className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-hero text-xl font-black text-white shadow-soft">
                V
              </div>
              <div>
                <p className="text-xl font-black tracking-tight text-slate-950">
                  {settings?.siteName || 'visa-work'}
                </p>
                <p className="text-xs text-slate-500">منصة عربية للعمل بالخارج والتأشيرات</p>
              </div>
            </Link>

            <nav className="hidden items-center gap-6 lg:flex">
              {navigation.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `text-sm font-semibold transition ${
                      isActive ? 'text-brand-700' : 'text-slate-600 hover:text-slate-950'
                    }`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <div className="hidden w-full max-w-sm lg:block">
              <SearchBar compact onSubmit={handleSearch} />
            </div>
          </div>

          {isOpen ? (
            <div className="mt-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-soft lg:hidden">
              <div className="mb-4">
                <SearchBar compact onSubmit={handleSearch} />
              </div>
              <div className="grid gap-3">
                {navigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    onClick={() => setIsOpen(false)}
                    className="rounded-2xl px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-brand-50"
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="border-t border-white/50 bg-white/75">
          <div className="page-shell flex flex-wrap items-center gap-3 py-3">
            <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700">
              <Globe2 className="h-4 w-4" />
              أقسام المنصة
            </span>
            {categories.slice(0, 6).map((category) => (
              <Link
                key={category._id}
                to={`/category/${category.slug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-medium text-slate-600 hover:border-brand-200 hover:text-brand-700"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="mt-20 border-t border-slate-200 bg-slate-950 text-slate-200">
        <div className="page-shell grid gap-10 py-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-600 font-black text-white">
                V
              </div>
              <div>
                <p className="text-xl font-black">{settings?.siteName || 'visa-work'}</p>
                <p className="text-sm text-slate-400">{settings?.siteDescription}</p>
              </div>
            </div>
            <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-400">
              {settings?.footerText ||
                'منصة عربية مهنية تقدم محتوى موثوقاً عن العمل بالخارج وتأشيرات العمل والهجرة القانونية.'}
            </p>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <h3 className="text-sm font-bold text-white">روابط مهمة</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                {navigation.map((item) => (
                  <Link key={item.to} to={item.to} className="hover:text-white">
                    {item.label}
                  </Link>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">التواصل والمتابعة</h3>
              <div className="mt-4 grid gap-3 text-sm text-slate-400">
                <a href={`mailto:${settings?.contactEmail || 'contact@visa-work.com'}`} className="hover:text-white">
                  {settings?.contactEmail || 'contact@visa-work.com'}
                </a>
                {Object.entries(settings?.socialLinks || {}).map(([key, value]) =>
                  value ? (
                    <a key={key} href={value} target="_blank" rel="noreferrer" className="hover:text-white">
                      {key}
                    </a>
                  ) : null
                )}
                <Link to="/admin/login" className="inline-flex items-center gap-2 hover:text-white">
                  <ShieldCheck className="h-4 w-4" />
                  دخول الإدارة
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default PublicLayout;
