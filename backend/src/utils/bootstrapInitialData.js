import { Article } from '../models/Article.js';
import { syncContentLibrary } from '../seed/syncContentLibrary.js';

export const bootstrapInitialData = async () => {
  const articleCount = await Article.countDocuments();

  const result = await syncContentLibrary({
    includeArticles: articleCount === 0,
    forceHomepageCuration: articleCount === 0
  });

  return {
    categories: result.categories.length,
    articles: result.articleSync.articles.length
  };
};
