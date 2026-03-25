import { ArrowLeft, ArrowRight, ChevronDown, Languages, Menu, MoonStar, Sparkles, SunMedium, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '../components/common/SearchBar';
import { useSite } from '../contexts/SiteContext';
import { useUi } from '../contexts/UiContext';
import { buildCategoryGroups, buildUtilityNavigation } from '../utils/navigation';

function PublicLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { settings, categories } = useSite();
  const { locale, localeOptions, setLocale, theme, toggleTheme, t, isRtl } = useUi();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openGroupKey, setOpenGroupKey] = useState('work-abroad');
  const categoryGroups = useMemo(() => buildCategoryGroups(categories, locale, t), [categories, locale]);
  const utilityNavigation = useMemo(() => buildUtilityNavigation(t), [locale]);
  const logoSrc = settings?.logo || '/visa-work-logo.svg';
  const DirectionalArrow = isRtl ? ArrowLeft : ArrowRight;
  const footerDescription = locale === 'ar' ? settings?.footerText || t('nav.footerDescription') : t('nav.footerDescription');

  useEffect(() => {
    if (!isMenuOpen) {
      document.body.style.overflow = '';
      return;
    }

    document.body.style.overflow = 'hidden';

    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const closeMobileMenu = () => setIsMenuOpen(false);

  const handleSearch = (value) => {
    if (!value) {
      return;
    }

    navigate(`/search?q=${encodeURIComponent(value)}`);
    closeMobileMenu();
  };

  const toggleMobileGroup = (key) => {
    setOpenGroupKey((current) => (current === key ? '' : key));
  };

  const isGroupActive = (group) => group.items.some((item) => location.pathname === `/category/${item.slug}`);

  const renderLocaleSwitcher = (compact = false) => (
    <div
      className={`inline-flex items-center rounded-full border border-slate-200 bg-white/85 p-1 shadow-sm dark:border-slate-700 dark:bg-slate-900/90 ${
        compact ? 'w-full justify-between' : ''
      }`}
    >
      {!compact ? (
        <span className="inline-flex items-center gap-2 px-3 text-xs font-semibold text-slate-500 dark:text-slate-400">
          <Languages className="h-4 w-4" />
          {t('controls.language')}
        </span>
      ) : null}
      <div className="inline-flex items-center gap-1">
        {localeOptions.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setLocale(option.value)}
            className={`rounded-full px-3 py-2 text-xs font-bold transition ${
              locale === option.value
                ? 'bg-brand-700 text-white shadow-sm'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
            }`}
          >
            {compact ? option.label : option.shortLabel}
          </button>
        ))}
      </div>
    </div>
  );

  const renderThemeToggle = (compact = false) => (
    <button
      type="button"
      onClick={toggleTheme}
      className={`inline-flex items-center justify-center gap-2 rounded-full border border-slate-200 bg-white/85 px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-brand-200 hover:text-brand-700 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 dark:hover:border-brand-500 dark:hover:text-brand-200 ${
        compact ? 'w-full' : ''
      }`}
      aria-label={t('controls.themeToggle')}
    >
      {theme === 'dark' ? <SunMedium className="h-4 w-4" /> : <MoonStar className="h-4 w-4" />}
      <span>{theme === 'dark' ? t('controls.themeLight') : t('controls.themeDark')}</span>
    </button>
  );

  return (
    <div className={theme === 'dark' ? 'dark' : ''}>
      <div className="min-h-screen bg-transparent text-slate-900 dark:bg-slate-950 dark:text-slate-100" dir={isRtl ? 'rtl' : 'ltr'}>
        <header className="sticky top-0 z-40 border-b border-brand-100/80 bg-white/90 backdrop-blur-xl dark:border-slate-800 dark:bg-slate-950/85">
          <div className="page-shell py-4">
            <div className="flex items-center justify-between gap-4 lg:gap-6">
              <button
                type="button"
                onClick={() => setIsMenuOpen((current) => !current)}
                className="order-1 inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-brand-100 bg-white text-brand-700 shadow-sm transition hover:border-brand-200 hover:text-brand-900 dark:border-slate-700 dark:bg-slate-900 dark:text-brand-200 dark:hover:border-brand-500 lg:hidden"
                aria-expanded={isMenuOpen}
                aria-label={isMenuOpen ? t('controls.closeMenu') : t('controls.openMenu')}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              <Link to="/" className="order-2 min-w-0 flex-none lg:order-1" onClick={closeMobileMenu}>
                <img src={logoSrc} alt={settings?.siteName || 'visa-work'} className="h-12 w-auto object-contain sm:h-14" />
              </Link>

              <nav className="order-2 hidden items-center gap-3 lg:flex">
                {categoryGroups.map((group) => (
                  <div key={group.key} className="group relative">
                    <button
                      type="button"
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition ${
                        isGroupActive(group)
                          ? 'border-brand-200 bg-brand-50 text-brand-700 dark:border-brand-500/40 dark:bg-brand-500/10 dark:text-brand-200'
                          : 'border-transparent bg-slate-100/90 text-slate-700 hover:border-brand-100 hover:bg-white hover:text-brand-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-brand-500/40 dark:hover:bg-slate-800 dark:hover:text-brand-200'
                      }`}
                      aria-haspopup="true"
                    >
                      {group.label}
                      <ChevronDown className="h-4 w-4 transition group-hover:rotate-180" />
                    </button>

                    <div className="pointer-events-none invisible absolute right-0 top-full z-50 mt-3 w-[320px] translate-y-2 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:visible group-focus-within:translate-y-0 group-focus-within:opacity-100">
                      <div className="rounded-[30px] border border-brand-100 bg-white/95 p-3 shadow-soft dark:border-slate-800 dark:bg-slate-900/96">
                        <div className="px-3 pb-3">
                          <p className="text-sm font-bold text-slate-950 dark:text-white">{group.label}</p>
                          <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{group.description}</p>
                        </div>

                        <div className="grid gap-2">
                          {group.items.map((item) => (
                            <Link
                              key={item.slug}
                              to={item.href}
                              className="group/item flex items-start justify-between gap-3 rounded-[22px] border border-transparent bg-slate-50/90 px-4 py-3 transition hover:border-brand-100 hover:bg-brand-50 dark:bg-slate-800/80 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
                            >
                              <div>
                                <p className="text-sm font-bold text-slate-900 transition group-hover/item:text-brand-700 dark:text-white dark:group-hover/item:text-brand-200">
                                  {item.name}
                                </p>
                                <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{item.description}</p>
                              </div>
                              <DirectionalArrow className={`mt-1 h-4 w-4 flex-none text-slate-400 transition ${isRtl ? 'group-hover/item:-translate-x-1' : 'group-hover/item:translate-x-1'} group-hover/item:text-accent-500`} />
                            </Link>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </nav>

              <div className="order-3 hidden min-w-0 flex-1 lg:block">
                <div className="mr-auto max-w-sm">
                  <SearchBar compact onSubmit={handleSearch} />
                </div>
              </div>

              <div className="order-4 hidden items-center gap-2 xl:flex">
                {renderLocaleSwitcher()}
                {renderThemeToggle()}
              </div>

            </div>

            <div className="mt-4 hidden items-center justify-between gap-6 border-t border-brand-100/70 pt-4 lg:flex dark:border-slate-800">
              <div className="flex flex-wrap items-center gap-2">
                {utilityNavigation.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-full px-4 py-2 text-xs font-semibold transition ${
                        isActive
                          ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                          : 'text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white'
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </div>

              <span className="inline-flex items-center gap-2 rounded-full bg-brand-50 px-4 py-2 text-xs font-semibold text-brand-700 dark:bg-brand-500/10 dark:text-brand-200">
                <Sparkles className="h-4 w-4 text-accent-500" />
                {t('nav.badge')}
              </span>
            </div>

            {isMenuOpen ? (
              <div className="absolute inset-x-0 top-full z-50 px-4 pb-4 pt-2 lg:hidden">
                <div className="max-h-[calc(100vh-7rem)] overflow-y-auto overscroll-contain rounded-[32px] border border-brand-100 bg-white/95 p-4 shadow-soft dark:border-slate-800 dark:bg-slate-950/95">
                  <div className="mb-4">
                    <SearchBar compact onSubmit={handleSearch} />
                  </div>

                  <div className="mb-4 grid gap-3 sm:grid-cols-2">
                    {renderLocaleSwitcher(true)}
                    {renderThemeToggle(true)}
                  </div>

                  <div className="grid gap-3">
                    {categoryGroups.map((group) => (
                      <div key={group.key} className="rounded-[26px] border border-slate-200/80 bg-slate-50/80 p-2 dark:border-slate-800 dark:bg-slate-900/80">
                        <button
                          type="button"
                          onClick={() => toggleMobileGroup(group.key)}
                          className="flex w-full items-center justify-between gap-3 rounded-[22px] px-3 py-3 text-start"
                        >
                          <div>
                            <p className="text-sm font-bold text-slate-950 dark:text-white">{group.label}</p>
                            <p className="mt-1 text-xs leading-6 text-slate-500 dark:text-slate-400">{group.description}</p>
                          </div>
                          <ChevronDown
                            className={`h-4 w-4 flex-none text-slate-500 transition ${
                              openGroupKey === group.key ? 'rotate-180 text-brand-700 dark:text-brand-200' : ''
                            }`}
                          />
                        </button>

                        {openGroupKey === group.key ? (
                          <div className="mt-2 grid gap-2">
                            {group.items.map((item) => (
                              <Link
                                key={item.slug}
                                to={item.href}
                                onClick={closeMobileMenu}
                                className="rounded-[22px] border border-white bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:border-brand-100 hover:bg-brand-50 hover:text-brand-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5 dark:hover:text-brand-200"
                              >
                                <span className="block">{item.name}</span>
                                <span className="mt-1 block text-xs font-normal leading-6 text-slate-500 dark:text-slate-400">
                                  {item.description}
                                </span>
                              </Link>
                            ))}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 border-t border-brand-100 pt-4 dark:border-slate-800">
                    <p className="text-xs font-bold uppercase tracking-[0.18em] text-slate-400">{t('nav.siteLinks')}</p>
                    <div className="mt-3 grid gap-2 sm:grid-cols-2">
                      {utilityNavigation.map((item) => (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={closeMobileMenu}
                          className={({ isActive }) =>
                            `rounded-[22px] px-4 py-3 text-sm font-semibold transition ${
                              isActive
                                ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200'
                                : 'bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white'
                            }`
                          }
                        >
                          {item.label}
                        </NavLink>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}
          </div>
        </header>

        <main className="pb-4">
          <Outlet />
        </main>

        <footer className="mt-20 border-t border-brand-100 bg-slate-950 text-slate-200 dark:border-slate-800 dark:bg-slate-950">
          <div className="page-shell grid gap-10 py-12 lg:grid-cols-[1.15fr_0.85fr_0.8fr]">
            <div>
              <div className="inline-flex rounded-[30px] bg-white px-5 py-4 shadow-soft dark:bg-slate-900">
                <img src={logoSrc} alt={settings?.siteName || 'visa-work'} className="h-12 w-auto object-contain sm:h-14" />
              </div>
              <p className="mt-5 max-w-xl text-sm leading-8 text-slate-400">{footerDescription}</p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">{t('nav.primarySections')}</h3>
              <div className="mt-4 grid gap-3">
                {categoryGroups.map((group) => (
                  <div key={group.key} className="rounded-[28px] border border-white/10 bg-white/5 p-4">
                    <Link to={group.href} className="text-sm font-bold text-white hover:text-accent-300">
                      {group.label}
                    </Link>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {group.items.map((item) => (
                        <Link
                          key={item.slug}
                          to={item.href}
                          className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-300 transition hover:border-accent-400/40 hover:text-white"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-1">
              <div>
                <h3 className="text-sm font-bold text-white">{t('nav.siteLinks')}</h3>
                <div className="mt-4 grid gap-3 text-sm text-slate-400">
                  {utilityNavigation.map((item) => (
                    <Link key={item.to} to={item.to} className="hover:text-white">
                      {item.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">{t('nav.connect')}</h3>
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
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default PublicLayout;
