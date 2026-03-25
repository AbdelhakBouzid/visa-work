import DOMPurify from 'dompurify';
import { Clock3, UserRound } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import ArticleCard from '../../components/common/ArticleCard';
import CategoryBadge from '../../components/common/CategoryBadge';
import LoadingScreen from '../../components/common/LoadingScreen';
import Seo from '../../components/common/Seo';
import ShareButtons from '../../components/common/ShareButtons';
import TableOfContents from '../../components/common/TableOfContents';
import { useUi } from '../../contexts/UiContext';
import { publicApi } from '../../services/api';
import { getArticleFeaturedImage } from '../../utils/articlePlaceholders';
import { addHeadingAnchors, generateTocFromHtml } from '../../utils/content';
import { calculateReadingTime, formatLocalizedDate } from '../../utils/formatters';

function ArticlePage() {
  const { slug } = useParams();
  const { locale, t } = useUi();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    publicApi
      .getArticleBySlug(slug)
      .then((response) => setData(response))
      .finally(() => setLoading(false));
  }, [slug]);

  const article = data?.article;
  const relatedArticles = data?.relatedArticles || [];

  const anchoredContent = useMemo(() => addHeadingAnchors(article?.content || ''), [article?.content]);
  const tableOfContents = useMemo(() => generateTocFromHtml(anchoredContent), [anchoredContent]);
  const sanitizedHtml = useMemo(() => DOMPurify.sanitize(anchoredContent), [anchoredContent]);

  if (loading) {
    return <LoadingScreen fullScreen />;
  }

  if (!article) {
    return (
      <div className="page-shell py-20">
        <div className="surface-card p-10 text-center">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">{t('pages.article.missing')}</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <Seo
        title={article.seoTitle || article.title}
        description={article.seoDescription || article.excerpt}
        image={article.featuredImage}
        type="article"
      />

      <article className="page-shell py-14">
        <div className="grid gap-8 lg:grid-cols-[1fr_300px]">
          <div>
            <CategoryBadge category={article.category} />
            <h1 className="mt-5 text-4xl font-black leading-tight text-slate-950 dark:text-white md:text-5xl">
              {article.title}
            </h1>
            <p className="mt-5 max-w-3xl text-base leading-8 text-slate-600 md:text-lg dark:text-slate-300">{article.excerpt}</p>

            <div className="mt-6 flex flex-wrap items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
              <span className="inline-flex items-center gap-2">
                <UserRound className="h-4 w-4" />
                {article.author?.name || t('common.editorialTeam')}
              </span>
              <span>{formatLocalizedDate(article.publishedAt || article.createdAt, locale)}</span>
              <span className="inline-flex items-center gap-2">
                <Clock3 className="h-4 w-4" />
                {t('common.readingMinutes', { count: calculateReadingTime(article.content) })}
              </span>
            </div>

            <img
              src={getArticleFeaturedImage(article)}
              alt={article.title}
              className="mt-8 h-[320px] w-full rounded-[32px] object-cover shadow-soft md:h-[460px]"
            />

            <div className="mt-8">
              <ShareButtons url={window.location.href} title={article.title} />
            </div>

            <div
              className="article-content mt-10 rounded-[32px] border border-slate-200 bg-white p-6 shadow-soft dark:border-slate-800 dark:bg-slate-900 md:p-10"
              dangerouslySetInnerHTML={{ __html: sanitizedHtml }}
            />
          </div>

          <div>
            <TableOfContents items={tableOfContents} />
          </div>
        </div>

        {relatedArticles.length ? (
          <section className="mt-20">
            <h2 className="section-title">{t('common.relatedArticles')}</h2>
            <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <ArticleCard key={relatedArticle._id} article={relatedArticle} />
              ))}
            </div>
          </section>
        ) : null}
      </article>
    </>
  );
}

export default ArticlePage;
