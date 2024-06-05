"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { TaskCardSkeleton } from "@/app/task/TaskCardSkeleton";
import { useToolCtx } from "@/app/task/ToolCtxProvider";
import { IMongoQueryRes, ITodo } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { useTaskModalStoreCtx, useUserStoreCtx } from "@/utils/externalStores";
import { filterPeriod } from "@/utils/filterPeriod";
import { filterTag } from "@/utils/filterTag";
import { formatPeriod } from "@/utils/formatPeriod";
import { updateTodo } from "@/utils/updateTodo";
import { DragEvent, ReactNode, useCallback, useState } from "react";
import { IoIosAdd } from "react-icons/io";
import {
  IoFileTrayStackedOutline,
  IoFlashOutline,
  IoNewspaperOutline,
  IoRibbonOutline,
  IoTimeOutline,
} from "react-icons/io5";

interface Props {
  className?: string;
  label: TASK_STATUS;
  children: (taskList: ITodo[]) => ReactNode;
}

const TODAY = new Date().getTime();

const LABEL_ICON: Record<TASK_STATUS, ReactNode> = {
  [TASK_STATUS.BACKLOG]: <IoFileTrayStackedOutline className="size-5" />,
  [TASK_STATUS.NEW_REQUEST]: <IoNewspaperOutline className="size-5" />,
  [TASK_STATUS.IN_PROGRESS]: <IoFlashOutline className="size-5" />,
  [TASK_STATUS.COMPLETE]: <IoRibbonOutline className="size-5" />,
};

export const TaskContainer = (props: Props) => {
  const { className = "", label, children } = props;
  const { list, loading: loadingList, reFetch } = useTaskCtx();
  const { selectedTag, selectedPeriod } = useToolCtx();
  const { dragged, setDragged } = useDraggableTask();
  const { useStore: useUserStore } = useUserStoreCtx();
  const [email] = useUserStore((state) => state.email);
  const { useStore: useTaskModalStore } = useTaskModalStoreCtx();
  const [, setTaskModal] = useTaskModalStore((state) => state);
  const [isDragOver, setIsDragOver] = useState(false);
  const [loading, setLoading] = useState(false);

  function handleOnDragEnter() {
    setIsDragOver(true);
  }

  function handleOnDragLeave() {
    setIsDragOver(false);
  }

  const handleOnDrop = useCallback(() => {
    if (dragged && dragged.status.name !== label) {
      const updatedTask: ITodo = {
        ...dragged,
        status: {
          ...dragged.status,
          name: label,
        },
      };
      setLoading(true);
      updateTodo(dragged, updatedTask)
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          reFetch().finally(() => {
            setLoading(false);
          });
          setDragged();
        });
    }
    setIsDragOver(false);
  }, [dragged, label, reFetch, setDragged]);

  function handlePreventDefault(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleOpenContent() {
    const newTask = {
      detail: "Take some notes.",
      userEmail: email,
      title: "New Task",
      status: {
        name: label,
      },
      tags: [],
    };
    setTaskModal({
      action: "add",
      task: newTask,
      onClose: handleCloseContent,
      handleLoading: setLoading,
    });
    setTaskModal({ open: true });
  }

  function handleCloseContent() {
    setTaskModal({ open: false });
  }

  return (
    <div
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      onDragOver={handlePreventDefault}
      onDrop={handleOnDrop}
      className={`flex flex-col py-3 px-4 gap-4 h-full w-full transition-colors rounded-xl ${className} ${isDragOver ? "bg-gray-d0-500/20" : "bg-gray-d0-500/10"} ${loading ? "animate-pulse pointer-events-none" : "pointer-events-auto"}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          {LABEL_ICON[label]}
          <span className="text-lg font-bold">{label}</span>
        </div>
        <button
          type="button"
          onClick={handleOpenContent}
          className="transition-colors hover:text-blue-5F-500"
        >
          <IoIosAdd className="size-6" />
        </button>
      </div>
      {loadingList && <TaskCardSkeleton />}
      {!loadingList &&
        list[label] &&
        children(
          filterPeriod(selectedPeriod, filterTag(selectedTag, list[label])),
        )}

      {isDragOver && dragged && dragged.status.name !== label && (
        <div className="flex flex-col rounded-2xl md:p-4 p-2 border border-solid border-gray-d0-500/50 pointer-events-none">
          <span className="font-semibold">{dragged.title}</span>
          <div className="flex items-center gap-1 py-1">
            <IoTimeOutline
              className={`size-4 ${new Date(dragged.expiry ?? new Date()).getTime() < TODAY ? "text-red-ff-500" : "text-gray-500"}`}
            />
            <span className="text-xs text-gray-d0-500/50 text-start break-words">
              {formatPeriod(dragged.iat, dragged.expiry)}
            </span>
          </div>
          <div className="flex items-center flex-wrap mt-2 gap-2">
            {dragged.tags.map((tag) => (
              <TagBlock key={tag.name} tag={tag} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
