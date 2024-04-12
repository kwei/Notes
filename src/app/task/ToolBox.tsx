"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { IMongoQueryRes } from "@/type";
import { updateTodo } from "@/utils/updateTodo";
import { HTMLAttributes, ReactNode, useCallback } from "react";
import { IoMdDownload } from "react-icons/io";
import { IoSaveOutline, IoSyncOutline } from "react-icons/io5";

interface Props {
  className?: string;
}

export const ToolBox = ({ className = "" }: Props) => {
  const { dragged, updated, setUpdated, setDragged } = useDraggableTask();
  const { reFetch } = useTaskCtx();

  const reFresh = useCallback(() => {
    reFetch();
  }, [reFetch]);

  const update = useCallback(() => {
    if (dragged && updated) {
      updateTodo(dragged, updated)
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          setUpdated();
          setDragged();
        });
    }
  }, [dragged, setDragged, setUpdated, updated]);

  const save = useCallback(() => {}, []);

  return (
    <div
      className={`w-full flex items-center justify-end gap-5 bg-gray-800 p-3 pr-5 rounded-t-3xl ${className}`}
    >
      <ActionBtn onClick={update} title="Update">
        <IoSaveOutline className="size-5" />
      </ActionBtn>
      <ActionBtn onClick={save} title="Save">
        <IoMdDownload className="size-5" />
      </ActionBtn>
      <ActionBtn onClick={reFresh} title="Sync">
        <IoSyncOutline className="size-5" />
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
