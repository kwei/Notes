"use client";

import { Loading } from "@/components/Loading";
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
      fetch(`/api/notion/note?id=${articleId}`)
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
    return <Loading />;
  } else if (!article) return null;

  return (
    <div className="w-full h-auto flex flex-col p-8 md:p-12">
      <div className="text-sm w-full justify-end flex items-center gap-2">
        <RiNotionFill className="size-6" />
        <a
          href={`https://www.notion.so/${process.env.NEXT_PUBLIC_NOTION_NOTE_TABLE_ID}?p=${articleId}`}
          target="_blank"
          rel="noreferrer noopener"
        >
          <span className="underline">Source</span>
        </a>
      </div>
      <div className="flex flex-col">{parse(article)}</div>
    </div>
  );
};
