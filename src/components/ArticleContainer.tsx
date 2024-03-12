"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import parse from "html-react-parser";
import { FaGithub } from "react-icons/fa6";
import Prism from "prismjs";

export const ArticleContainer = () => {
  const searchParams = useSearchParams();
  const [article, setArticle] = useState<string>();
  const [loading, setLoading] = useState(false);

  const articleName = useMemo(
    () => searchParams.get("articleName"),
    [searchParams],
  );

  useEffect(() => {
    setLoading(true);
    fetch(`/api/article?fileName=${articleName}`)
      .then((res) => res.json())
      .then((data: string) => {
        setArticle(data);
      })
      .catch((e) => {
        console.log("Fetch Article Failed: ", e);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [articleName]);

  useEffect(() => {
    if (article) Prism.highlightAll();
  }, [article]);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <span className="animate-spin size-6 rounded-full border-2 border-t-0 border-l-0 border-solid border-gray-400"></span>
      </div>
    );
  } else if (!article) return null;

  return (
    <div className="w-full h-auto flex flex-col p-8">
      <div className="text-sm w-full justify-end flex items-center gap-2">
        <FaGithub className="size-4" />
        <a
          href={`https://github.com/kwei/Notes/tree/main/src/articles/${articleName}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="underline">Source</span>
        </a>
      </div>
      <div className="mx-4 flex flex-col">{parse(article)}</div>
    </div>
  );
};
