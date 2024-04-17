"use client";

import { ArticleTree } from "@/components/ArticleTree";
import { Loading } from "@/components/Loading";
import { useGetArticleList } from "@/hooks/useGetArticleList";

interface Props {
  className?: string;
}

export const TopicList = (props: Props) => {
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
      {loading && <Loading />}
      <ArticleTree articleTable={articleTable} />
    </aside>
  );
};
