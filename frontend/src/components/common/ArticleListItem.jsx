import { Link } from 'react-router-dom';
import { formatArabicDate } from '../../utils/formatters';

function ArticleListItem({ article }) {
  return (
    <Link
      to={`/article/${article.slug}`}
      className="flex items-start gap-4 rounded-3xl border border-slate-200 bg-white p-4 transition hover:border-brand-200 hover:bg-brand-50/40"
    >
      <img
        src={article.featuredImage || '/seed/work-abroad.svg'}
        alt={article.title}
        loading="lazy"
        className="h-24 w-24 flex-none rounded-2xl object-cover"
      />
      <div className="min-w-0">
        <div className="mb-2 text-xs font-semibold text-brand-700">
          {article.category?.name || 'عام'}
        </div>
        <h3 className="clamp-2 text-base font-bold text-slate-900">{article.title}</h3>
        <p className="mt-2 clamp-2 text-sm leading-6 text-slate-600">{article.excerpt}</p>
        <p className="mt-2 text-xs text-slate-400">{formatArabicDate(article.publishedAt || article.createdAt)}</p>
      </div>
    </Link>
  );
}

export default ArticleListItem;
