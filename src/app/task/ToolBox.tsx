"use client";

import { HTMLAttributes, ReactNode, useCallback } from "react";
import { IoMdDownload } from "react-icons/io";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  const save = useCallback(() => {}, []);

  return (
    <div
      className={`w-full flex items-center justify-end gap-5 bg-gray-800 p-3 pr-5 md:rounded-t-3xl ${className}`}
    >
      <ActionBtn onClick={save} title="Save">
        <IoMdDownload className="size-5" />
      </ActionBtn>
    </div>
  );
};

interface ActionBtnProps extends Omit<HTMLAttributes<HTMLButtonElement>, ""> {
  className?: string;
  onClick?: () => void;
  children: ReactNode;
}

const ActionBtn = ({
  onClick,
  children,
  className,
  ...legacy
}: ActionBtnProps) => {
  return (
    <button
      {...legacy}
      className={`transition-colors hover:text-blue-5F-500 ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};
