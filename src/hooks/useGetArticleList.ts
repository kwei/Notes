"use client";

import { ArticleList } from "@/type";
import { formatArticleList } from "@/utils/formatArticleList";
import { useEffect, useMemo, useState } from "react";

export const useGetArticleList = () => {
  const [articleList, setArticleList] = useState<ArticleList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const articleTable = useMemo(() => {
    return formatArticleList(articleList);
  }, [articleList]);

  useEffect(() => {
    setLoading(true);
    fetch("/api/notion/note")
      .then((res) => res.json())
      .then((data: ArticleList[]) => {
        setArticleList(data);
      })
      .catch((e) => {
        console.log("Fetch Article List Failed: ", e);
        setError(e.toString());
        return [];
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { articleTable, loading, error };
};
