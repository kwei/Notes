"use client";

import { ArticleTree } from "@/components/ArticleTree";
import { useGetArticleList } from "@/hooks/useGetArticleList";

interface Props {
  className?: string;
}

export const TopicList = async (props: Props) => {
  const { loading, error, articleTable } = useGetArticleList();

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
      <ArticleTree articleTable={articleTable} />
    </aside>
  );
};
