import { Clock3, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import CategoryBadge from './CategoryBadge';
import { calculateReadingTime, formatArabicDate } from '../../utils/formatters';

function ArticleCard({ article, featured = false }) {
  if (!article) {
    return null;
  }

  return (
    <article
      className={`group overflow-hidden rounded-[28px] border border-slate-200 bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-2xl ${
        featured ? 'grid gap-0 md:grid-cols-[1.15fr_0.85fr]' : ''
      }`}
    >
      <Link to={`/article/${article.slug}`} className="block overflow-hidden">
        <img
          src={article.featuredImage || '/seed/work-abroad.svg'}
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
          <span className="text-xs text-slate-400">{formatArabicDate(article.publishedAt || article.createdAt)}</span>
        </div>
        <Link to={`/article/${article.slug}`} className="block">
          <h3 className={`${featured ? 'text-3xl' : 'text-xl'} font-bold leading-tight text-slate-900`}>
            {article.title}
          </h3>
        </Link>
        <p className="clamp-3 text-sm leading-7 text-slate-600">{article.excerpt}</p>
        <div className="mt-auto flex flex-wrap items-center gap-4 text-xs text-slate-500">
          <span>{article.author?.name || 'فريق التحرير'}</span>
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {calculateReadingTime(article.content)} دقائق
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
