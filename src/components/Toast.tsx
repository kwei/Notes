"use client";

import { TOAST_TYPE, TOAST_TYPE_COLOR } from "@/utils/constants";
import { useToastStoreCtx } from "@/utils/externalStores";
import { ReactNode, useEffect, useRef } from "react";
import { IoIosInformationCircleOutline, IoMdCheckmark } from "react-icons/io";
import { IoWarningOutline } from "react-icons/io5";
import { MdMoodBad } from "react-icons/md";

const TYPE_ICON: Record<TOAST_TYPE, ReactNode> = {
  [TOAST_TYPE.info]: <IoIosInformationCircleOutline className="size-4" />,
  [TOAST_TYPE.success]: <IoMdCheckmark className="size-4" />,
  [TOAST_TYPE.warning]: <IoWarningOutline className="size-4" />,
  [TOAST_TYPE.error]: <MdMoodBad className="size-4" />,
};

export const Toast = () => {
  const { useStore: useToastStore } = useToastStoreCtx();
  const [data, setData] = useToastStore((state) => state);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let timeout = setTimeout(() => {});
    if (data.show) {
      timeout = setTimeout(() => {
        ref.current?.classList.add("animate-slideOut-to-top");
        clearTimeout(timeout);
      }, 3000);
      setTimeout(() => {
        ref.current?.classList.remove("animate-slideOut-to-top");
        setData({ show: false });
      }, 3200);
    } else {
      clearTimeout(timeout);
    }
  }, [data.show, setData]);

  if (!data.show) return null;
  return (
    <div className="fixed z-50 top-5 left-0 right-0 flex items-center justify-center">
      <div
        ref={ref}
        className="flex bg-gray-800 items-center rounded-2xl overflow-hidden border-2 border-solid border-gray-d0-500 shadow-gray-d0-500/50 shadow-md animate-slideIn-from-top"
      >
        <div
          className="py-2 px-3 text-black flex items-center justify-center"
          style={{
            color: TOAST_TYPE_COLOR[data.type],
          }}
        >
          {TYPE_ICON[data.type]}
        </div>
        <div className="py-2 pr-3 max-w-[300px] whitespace-nowrap overflow-hidden text-ellipsis text-left">
          {data.msg}
        </div>
      </div>
    </div>
  );
};
