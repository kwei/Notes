"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { TaskModal } from "@/app/task/TaskModal";
import { ITodo } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { formatPeriod } from "@/utils/formatPeriod";
import { DragEvent, ReactNode, useCallback, useMemo, useState } from "react";
import { IoIosAdd } from "react-icons/io";

interface Props {
  className?: string;
  label: TASK_STATUS;
  children: (taskList: ITodo[]) => ReactNode;
}

export const TaskContainer = (props: Props) => {
  const { className = "", label, children } = props;
  const { removeFromList, set2List, list } = useTaskCtx();
  const { dragged, setUpdated } = useDraggableTask();
  const [isDragOver, setIsDragOver] = useState(false);
  const [openContent, setOpenContent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [newTask, setNewTask] = useState<ITodo>({
    detail: "Take some notes.",
    userEmail: "",
    title: "New Task",
    status: {
      name: label,
    },
    tags: [],
  });

  function handleOnDragEnter() {
    setIsDragOver(true);
  }

  function handleOnDragLeave() {
    setIsDragOver(false);
  }

  const handleOnDrop = useCallback(() => {
    if (dragged) {
      removeFromList(dragged.status.name, dragged);
      const updatedTask: ITodo = {
        ...dragged,
        status: {
          ...dragged.status,
          name: label,
        },
      };
      setUpdated(updatedTask);
      set2List(label, updatedTask);
    }
    setIsDragOver(false);
  }, [dragged, label, removeFromList, set2List, setUpdated]);

  function handlePreventDefault(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  function handleOpenContent() {
    setNewTask({
      detail: "Take some notes.",
      userEmail: "",
      title: "New Task",
      status: {
        name: label,
      },
      tags: [],
    });
    setOpenContent(true);
  }

  function handleCloseContent() {
    setOpenContent(false);
  }

  function handleSetLoading(status: boolean) {
    setLoading(status);
  }

  return (
    <div
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      onDragOver={handlePreventDefault}
      onDrop={handleOnDrop}
      className={`flex flex-col py-3 px-4 gap-4 h-full w-full transition-colors rounded-xl ${className} ${isDragOver ? "bg-gray-d0-500/20" : "bg-gray-d0-500/10"} ${loading ? "animate-pulse" : ""}`}
    >
      <div className="pl-4 flex justify-between items-center">
        <span className="text-lg font-bold">{label}</span>
        <button
          type="button"
          onClick={handleOpenContent}
          className="transition-colors hover:text-blue-5F-500"
        >
          <IoIosAdd className="size-6" />
        </button>
      </div>
      {list[label] && children(list[label])}
      {isDragOver && dragged && dragged.status.name !== label && (
        <div className="flex flex-col rounded-2xl md:p-4 p-2 border border-solid border-gray-d0-500/50 pointer-events-none">
          <span className="font-semibold">{dragged.title}</span>
          <div className="text-xs text-gray-d0-500/50">
            {formatPeriod(dragged.iat, dragged.expiry)}
          </div>
          <div className="flex items-center flex-wrap mt-2 gap-2">
            {dragged.tags.map((tag) => (
              <TagBlock key={tag.name} tag={tag} />
            ))}
          </div>
        </div>
      )}
      <TaskModal
        action="add"
        open={openContent}
        task={newTask}
        handleLoading={handleSetLoading}
        onClose={handleCloseContent}
      />
    </div>
  );
};
