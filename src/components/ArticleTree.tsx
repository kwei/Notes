"use client";

import { ArticleButton } from "@/components/ArticleButton";
import { CollapseContainer } from "@/components/CollapseContainer";
import { ArticleTable } from "@/type";
import { useRouter, useSearchParams } from "next/navigation";
import { Fragment, useCallback, useMemo } from "react";

interface Props {
  articleTable: ArticleTable;
  onClose?: () => void;
}

export const ArticleTree = (props: Props) => {
  const { articleTable, onClose } = props;
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
        `/?category=${category}&topic=${topic}&article=${article}&id=${id}`,
      );
      if (onClose) onClose();
    },
    [onClose, router],
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
