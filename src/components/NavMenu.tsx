"use client";

import { ArticleTree } from "@/components/ArticleTree";
import { MyInfo } from "@/components/MyInfo";
import { useFocusRef } from "@/hooks/useFocusRef";
import { useGetArticleList } from "@/hooks/useGetArticleList";
import { MdOutlineArrowBack } from "react-icons/md";

interface Props {
  onClose: () => void;
}

export const NavMenu = (props: Props) => {
  const ref = useFocusRef<HTMLDivElement>(props.onClose);
  const { loading, error, articleTable } = useGetArticleList();

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
      <ArticleTree articleTable={articleTable} />
    </div>
  );
};
