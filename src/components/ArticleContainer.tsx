"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";

interface Props {
  articleName: string;
}

export const ArticleContainer = (props: Props) => {
  const [article, setArticle] = useState<string>();

  useEffect(() => {
    fetch(`/api/article?fileName=${props.articleName}`)
      .then((res) => res.json())
      .then((data: string) => {
        setArticle(data);
      });
  }, [props.articleName]);

  if (!article) return null;
  return (
    <div className="w-full h-auto flex flex-col py-4 px-6">
      {parse(article)}
    </div>
  );
};
