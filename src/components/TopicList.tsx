"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import { useRouter, useSearchParams } from "next/navigation";
import { memo, ReactNode, useEffect, useMemo, useState } from "react";

interface Props {
  className?: string;
}

export const TopicList = (props: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<GitTree>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>();

  const articleName = useMemo(
    () => searchParams.get("article"),
    [searchParams],
  );

  function handleOnSelectArticle(
    category: string,
    topic: string,
    article: string,
  ) {
    router.push(`?category=${category}&topic=${topic}&article=${article}`);
  }

  useEffect(() => {
    setLoading(true);
    fetch(`/api/article?getList=true`)
      .then((res) => res.json())
      .then((data: GitTree) => {
        setArticles(data);
      })
      .catch((e) => {
        console.log("Fetch Article List Failed: ", e);
        setError(e.toString());
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

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
            <CollapseContainer key={topic} label={topic} className="pl-4">
              {files.map((file) => (
                <CollapseItem key={file.fileName}>
                  <ArticleButton
                    file={file}
                    category={category}
                    topic={topic}
                    selected={articleName === file.fileName}
                    onClick={handleOnSelectArticle}
                  />
                </CollapseItem>
              ))}
            </CollapseContainer>
          ))}
        </div>
      ))}
    </aside>
  );
};

const CollapseItem = ({ children }: { children: ReactNode }) => {
  return <div className="">{children}</div>;
};

const ArticleButton = memo(
  ({
    file,
    onClick,
    category,
    topic,
    selected,
  }: {
    file: { fileName: string; fileUrl: string };
    onClick: (category: string, topic: string, article: string) => void;
    category: string;
    topic: string;
    selected: boolean;
  }) => {
    function handleOnSelectArticle() {
      onClick(category, topic, file.fileName);
    }

    return (
      <button
        className={`rounded-lg w-full py-2 text-left pl-4 transition-all ${selected ? "bg-gray-500/70" : "hover:bg-gray-500/70"}`}
        onClick={handleOnSelectArticle}
        title={file.fileName}
      >
        {file.fileName}
      </button>
    );
  },
);
ArticleButton.displayName = "ArticleButton";
