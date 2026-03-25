import { Clock3, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useUi } from '../../contexts/UiContext';
import CategoryBadge from './CategoryBadge';
import { calculateReadingTime, formatLocalizedDate } from '../../utils/formatters';
import { getArticleFeaturedImage } from '../../utils/articlePlaceholders';

function ArticleCard({ article, featured = false }) {
  const { locale, t } = useUi();

  if (!article) {
    return null;
  }

  return (
    <article
      className={`group overflow-hidden rounded-[30px] border border-brand-100/80 bg-white/95 shadow-soft transition duration-300 hover:-translate-y-1.5 hover:border-brand-200 hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900/95 dark:hover:border-brand-500/40 ${
        featured ? 'grid gap-0 md:grid-cols-[1.15fr_0.85fr]' : ''
      }`}
    >
      <Link to={`/article/${article.slug}`} className="block overflow-hidden">
        <img
          src={getArticleFeaturedImage(article)}
          alt={article.title}
          loading="lazy"
          className={`w-full object-cover transition duration-500 group-hover:scale-105 ${
            featured ? 'h-full min-h-[260px]' : 'h-56'
          }`}
        />
      </Link>
      <div className="flex flex-col gap-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <CategoryBadge category={article.category} />
          <span className="text-xs text-slate-400 dark:text-slate-500">
            {formatLocalizedDate(article.publishedAt || article.createdAt, locale)}
          </span>
        </div>
        <Link to={`/article/${article.slug}`} className="block">
          <h3
            className={`${featured ? 'text-3xl' : 'text-xl'} font-bold leading-tight text-slate-900 transition group-hover:text-brand-700 dark:text-white dark:group-hover:text-brand-200`}
          >
            {article.title}
          </h3>
        </Link>
        <p className="clamp-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{article.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
          <span>{article.author?.name || t('common.editorialTeam')}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {t('common.readingMinutesShort', { count: calculateReadingTime(article.content) })}
          </span>
          <span className="inline-flex items-center gap-1">
            <Eye className="h-3.5 w-3.5" />
            {article.views || 0}
          </span>
        </div>
      </div>
    </article>
  );
}

export default ArticleCard;
