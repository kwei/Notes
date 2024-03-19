"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useGetArticleList = () => {
  const router = useRouter();
  const [articles, setArticles] = useState<GitTree>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  function handleOnSelectArticle(
    category: string,
    topic: string,
    article: string,
  ) {
    router.push(`?category=${category}&topic=${topic}&article=${article}`);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/article?getList=true`)
      .then((res) => res.json())
      .then((data: GitTree) => {
        setArticles(data);
      })
      .catch((e) => {
        console.log("Fetch Article List Failed: ", e);
        setError(e.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return {
    articles,
    loading,
    error,
    handleOnSelectArticle,
  };
};
