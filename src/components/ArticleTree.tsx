"use client";

import { ArticleButton } from "@/components/ArticleButton";
import { CollapseContainer } from "@/components/CollapseContainer";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useMemo } from "react";

export const ArticleTree = ({
  articleTable,
}: {
  articleTable: ArticleTable;
}) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const articleName = useMemo(
    () => searchParams.get("article"),
    [searchParams],
  );

  const articleTopic = useMemo(() => searchParams.get("topic"), [searchParams]);

  const handleOnSelectArticle = useCallback(
    (category: string, topic: string, article: string, id: string) => {
      router.push(
        `?category=${category}&topic=${topic}&article=${article}&id=${id}`,
      );
    },
    [router],
  );

  return (
    <Fragment>
      {Object.entries(articleTable).map(([category, topics]) => (
        <div
          key={category}
          className="w-full flex flex-col gap-4 border-b border-solid border-gray-500 p-4"
        >
          <label>{category}</label>
          {Object.entries(topics).map(([topic, files]) => (
            <CollapseContainer
              key={topic}
              label={topic}
              className="ml-2"
              open={articleTopic === topic}
            >
              {files.map((file) => (
                <ArticleButton
                  key={file.name}
                  file={file}
                  category={category}
                  topic={topic}
                  selected={articleName === file.name}
                  onClick={handleOnSelectArticle}
                />
              ))}
            </CollapseContainer>
          ))}
        </div>
      ))}
    </Fragment>
  );
};
