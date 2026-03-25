import { Link } from 'react-router-dom';
import { useUi } from '../../contexts/UiContext';
import { formatLocalizedDate } from '../../utils/formatters';
import { getLocalizedCategoryCopy } from '../../utils/i18n';

function ArticleListItem({ article }) {
  const { locale, t } = useUi();
  const categoryLabel =
    locale === 'ar'
      ? article.category?.name || t('common.genericCategory')
      : article.category?.slug
        ? getLocalizedCategoryCopy(locale, article.category.slug).name
        : t('common.genericCategory');

  return (
    <Link
      to={`/article/${article.slug}`}
      className="group flex items-start gap-4 rounded-[28px] border border-brand-100/70 bg-white/95 p-4 transition duration-200 hover:-translate-y-0.5 hover:border-brand-200 hover:bg-brand-50/50 dark:border-slate-800 dark:bg-slate-900/95 dark:hover:border-brand-500/40 dark:hover:bg-brand-500/5"
    >
      <img
        src={article.featuredImage || '/seed/work-abroad.svg'}
        alt={article.title}
        loading="lazy"
        className="h-24 w-24 flex-none rounded-2xl object-cover"
      />
      <div className="min-w-0">
        <div className="mb-2 text-xs font-semibold text-brand-700 dark:text-brand-200">{categoryLabel}</div>
        <h3 className="clamp-2 text-base font-bold text-slate-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200">
          {article.title}
        </h3>
        <p className="mt-2 clamp-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{article.excerpt}</p>
        <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
          {formatLocalizedDate(article.publishedAt || article.createdAt, locale)}
        </p>
      </div>
    </Link>
  );
}

export default ArticleListItem;
