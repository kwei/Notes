"use client";

import { ArticleTree } from "@/components/ArticleTree";
import { MyInfo } from "@/components/MyInfo";
import { useFocusRef } from "@/hooks/useFocusRef";
import { useGetArticleList } from "@/hooks/useGetArticleList";
import { useEffect, useRef } from "react";
import { MdOutlineArrowBack } from "react-icons/md";

interface Props {
  open: boolean;
  onClose: () => void;
}

export const NavMenu = (props: Props) => {
  const ref = useFocusRef<HTMLDivElement>(props.onClose);
  const { loading, error, articleTable } = useGetArticleList();
  const initRef = useRef(false);

  useEffect(() => {
    if (props.open) {
      initRef.current = true;
      ref.current?.classList.remove("opacity-0");
      ref.current?.classList.add("opacity-100");
      setTimeout(
        () => {
          ref.current?.classList.remove("animate-slideOut-to-left");
          ref.current?.classList.add("animate-slideIn-from-left");
        },
        initRef.current ? 0 : 150,
      );
    } else {
      ref.current?.classList.remove("animate-slideIn-from-left");
      ref.current?.classList.add("animate-slideOut-to-left");
      setTimeout(() => {
        ref.current?.classList.remove("opacity-100");
        ref.current?.classList.add("opacity-0");
      }, 150);
    }
  }, [props.open, ref]);

  return (
    <div
      ref={ref}
      className="fixed z-50 flex flex-col left-0 top-0 bottom-0 w-[350px] bg-gray-900 transition-opacity opacity-0"
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
      <ArticleTree articleTable={articleTable} onClose={props.onClose} />
    </div>
  );
};
