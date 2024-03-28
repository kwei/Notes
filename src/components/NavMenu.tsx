"use client";

import { ArticleButton } from "@/components/ArticleButton";
import { CollapseContainer } from "@/components/CollapseContainer";
import { MyInfo } from "@/components/MyInfo";
import { useFocusRef } from "@/hooks/useFocusRef";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";
import { MdOutlineArrowBack } from "react-icons/md";

interface Props {
  onClose: () => void;
  articleList: ArticleList[];
  loading?: boolean;
  error?: string;
}

export const NavMenu = (props: Props) => {
  const ref = useFocusRef<HTMLDivElement>(props.onClose);
  const searchParams = useSearchParams();
  const router = useRouter();

  const articleName = useMemo(
    () => searchParams.get("article"),
    [searchParams],
  );

  const articleTopic = useMemo(() => searchParams.get("topic"), [searchParams]);

  const articleList = useMemo(() => {
    if (props.articleList.length === 0) return {};
    const articleList: Record<
      string,
      Record<string, { name: string; id: string }[]>
    > = {};
    props.articleList.forEach((article) => {
      if (!articleList[article.category]) {
        articleList[article.category] = {};
      }
      if (!articleList[article.category][article.topic]) {
        articleList[article.category][article.topic] = [];
      }
      articleList[article.category][article.topic].push({
        name: article.name,
        id: article.id,
      });
    });
    return articleList;
  }, [props.articleList]);

  const handleOnSelectArticle = useCallback(
    (category: string, topic: string, article: string, id: string) => {
      router.push(
        `?category=${category}&topic=${topic}&article=${article}&id=${id}`,
      );
    },
    [router],
  );

  return (
    <div
      ref={ref}
      className="fixed flex flex-col left-0 top-0 bottom-0 w-[350px] bg-gray-900 animate-slideIn"
    >
      <div className="relative w-full flex items-center gap-4 px-4 py-4">
        <MyInfo />
        <button
          className="size-6 absolute top-4 right-4"
          onClick={props.onClose}
        >
          <MdOutlineArrowBack className="w-full h-full hover:text-blue-5F-500 transition-all" />
        </button>
      </div>

      {props.error && (
        <div className="flex flex-col p-4">
          <span className="text-red-500 mb-4 font-normal">
            Something Wrong :(
          </span>
          <span>{props.error}</span>
        </div>
      )}
      {props.loading && (
        <div className="w-full flex flex-col items-center p-4">
          <span className="animate-spin size-6 rounded-full border-2 border-t-0 border-l-0 border-solid border-gray-400"></span>
        </div>
      )}
      {Object.entries(articleList).map(([category, topics]) => (
        <div
          key={category}
          className="w-full flex flex-col border-b border-solid border-gray-500 p-4"
        >
          <label className="pb-2">{category}</label>
          {Object.entries(topics).map(([topic, files]) => (
            <CollapseContainer
              key={topic}
              label={topic}
              className="pl-4"
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
    </div>
  );
};
