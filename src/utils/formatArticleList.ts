export const formatArticleList = (articleList: ArticleList[]) => {
  if (articleList.length === 0) return {};
  const result: ArticleTable = {};
  articleList.forEach((article) => {
    if (!result[article.category]) {
      result[article.category] = {};
    }
    if (!result[article.category][article.topic]) {
      result[article.category][article.topic] = [];
    }
    result[article.category][article.topic].push({
      name: article.name,
      id: article.id,
    });
  });
  return result;
};
