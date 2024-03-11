"use client";

import { useEffect, useState } from "react";
import parse from "html-react-parser";
import { FaGithub } from "react-icons/fa6";

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
      <div className="text-sm w-full justify-end flex items-center gap-2">
        <FaGithub className="size-4" />
        <a
          href={`https://github.com/kwei/Notes/tree/main/src/articles/${props.articleName}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className='underline'>Source</span>
        </a>
      </div>
      {parse(article)}
    </div>
  );
};
