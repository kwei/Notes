"use client";

import { ArticleButton } from "@/components/ArticleButton";
import { CollapseContainer } from "@/components/CollapseContainer";
import { useGetArticleList } from "@/hooks/useGetArticleList";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";

interface Props {
  className?: string;
}

export const TopicList = (props: Props) => {
  const searchParams = useSearchParams();
  const { articles, loading, error, handleOnSelectArticle } =
    useGetArticleList();

  const articleName = useMemo(
    () => searchParams.get("article"),
    [searchParams],
  );

  const articleTopic = useMemo(() => searchParams.get("topic"), [searchParams]);

  return (
    <aside
      className={`flex flex-col h-full scrollbar overflow-hidden overflow-y-scroll ${props.className}`}
    >
      {error && (
        <div className="flex flex-col p-4">
          <span className="text-red-500 mb-4 font-normal">
            Something Wrong :(
          </span>
          <span>{error}</span>
        </div>
      )}
      {loading && (
        <div className="w-full flex flex-col items-center p-4">
          <span className="animate-spin size-6 rounded-full border-2 border-t-0 border-l-0 border-solid border-gray-400"></span>
        </div>
      )}
      {Object.entries(articles).map(([category, topics]) => (
        <div
          key={category}
          className="w-full flex flex-col border-b border-solid border-gray-500 p-4"
        >
          <label className="pb-2">{category.toUpperCase()}</label>
          {Object.entries(topics).map(([topic, files]) => (
            <CollapseContainer
              key={topic}
              label={topic}
              className="pl-4"
              open={articleTopic === topic}
            >
              {files.map((file) => (
                <ArticleButton
                  key={file.fileName}
                  file={file}
                  category={category}
                  topic={topic}
                  selected={articleName === file.fileName}
                  onClick={handleOnSelectArticle}
                />
              ))}
            </CollapseContainer>
          ))}
        </div>
      ))}
    </aside>
  );
};
