"use client";

import { ArticleButton } from "@/components/ArticleButton";
import { CollapseContainer } from "@/components/CollapseContainer";
import { MyInfo } from "@/components/MyInfo";
import { useFocusRef } from "@/hooks/useFocusRef";
import { useGetArticleList } from "@/hooks/useGetArticleList";
import { useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { MdOutlineArrowBack } from "react-icons/md";

interface Props {
  onClose: () => void;
}

export const NavMenu = (props: Props) => {
  const ref = useFocusRef(props.onClose);
  const { articles, loading, error, handleOnSelectArticle } =
    useGetArticleList();
  const searchParams = useSearchParams();

  const articleName = useMemo(
    () => searchParams.get("article"),
    [searchParams],
  );

  const articleTopic = useMemo(() => searchParams.get("topic"), [searchParams]);

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
    </div>
  );
};
