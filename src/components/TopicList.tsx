"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import { ReactNode, useEffect, useState } from "react";

interface Props {
  className?: string;
  setArticleId: (article: number) => void;
}

export const TopicList = (props: Props) => {
  const [articles, setArticles] = useState<GitTreeExtracted[]>([]);

  useEffect(() => {
    fetch(`/api/article?getList=true`)
      .then((res) => res.json())
      .then((data: GitTreeExtracted[]) => {
        setArticles(data);
      });
  }, []);

  return (
    <aside
      className={`flex flex-col h-full scrollbar gap-4 overflow-hidden overflow-y-scroll p-4 ${props.className}`}
    >
      <label>TOPICS</label>
      {articles.map((article) => (
        <CollapseContainer key={article.path[0]} label={article.path[0]}>
          <CollapseItem>
            <button>{article.fileName.split(".md")[0]}</button>
          </CollapseItem>
        </CollapseContainer>
      ))}
    </aside>
  );
};

const CollapseItem = ({ children }: { children: ReactNode }) => {
  return <div className="">{children}</div>;
};
