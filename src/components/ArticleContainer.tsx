"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import parse from "html-react-parser";
import Prism from "prismjs";
import { RiNotionFill } from "react-icons/ri";

export const ArticleContainer = () => {
  const searchParams = useSearchParams();
  const [article, setArticle] = useState<string>();
  const [loading, setLoading] = useState(false);

  const articleId = useMemo(() => searchParams.get("id"), [searchParams]);

  useEffect(() => {
    if (articleId) {
      setLoading(true);
      fetch(`/api/notion?id=${articleId}`)
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
    }
  }, [articleId]);

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
        <RiNotionFill className="size-6" />
        <a
          href={`https://www.notion.so/${process.env.NEXT_PUBLIC_NOTION_TABLE_ID}?p=${articleId}`}
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
