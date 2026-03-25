import { Link } from 'react-router-dom';
import Seo from '../../components/common/Seo';
import { useUi } from '../../contexts/UiContext';

function NotFoundPage() {
  const { t } = useUi();

  return (
    <>
      <Seo title="404" description={t('pages.notFound.seoDescription')} />
      <section className="page-shell flex min-h-[70vh] items-center justify-center py-14">
        <div className="surface-card max-w-2xl p-10 text-center">
          <span className="text-7xl font-black text-brand-700">404</span>
          <h1 className="mt-4 text-3xl font-black text-slate-950 dark:text-white">{t('pages.notFound.title')}</h1>
          <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{t('pages.notFound.description')}</p>
          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rounded-full bg-brand-700 px-5 py-3 text-sm font-bold text-white dark:bg-brand-600">
              {t('pages.notFound.homeCta')}
            </Link>
            <Link to="/articles" className="rounded-full bg-slate-100 px-5 py-3 text-sm font-bold text-slate-800 dark:bg-slate-900 dark:text-slate-100">
              {t('pages.notFound.articlesCta')}
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

export default NotFoundPage;
