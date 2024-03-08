"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";

interface Props {
  articleId: number;
}

export const ArticleContainer = (props: Props) => {
  const [article, setArticle] = useState<string>();

  useEffect(() => {
    fetch("/api/article?id=0")
      .then((res) => res.json())
      .then((data: string) => {
        setArticle(data);
      })
      .catch((e) => {
        console.log("fetch article error: ", e);
      });
  }, []);

  if (!article) return null;
  return <div className="w-full h-auto flex flex-col py-4 px-6">{parse(article)}</div>;
};
