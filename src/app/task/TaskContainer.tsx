"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { TagBlock } from "@/app/task/TagBlock";
import { useDraggableTask } from "@/app/task/DraggableTask";
import { Task } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { formatPeriod } from "@/utils/formatPeriod";
import { DragEvent, ReactNode, useCallback, useState } from "react";

interface Props {
  className?: string;
  label: TASK_STATUS;
  children: (taskList: Task[]) => ReactNode;
}

export const TaskContainer = (props: Props) => {
  const { className = "", label, children } = props;
  const { removeFromList, set2List, list } = useTaskCtx();
  const { dragged, setDragged } = useDraggableTask();
  const [isDragOver, setIsDragOver] = useState(false);

  function handleOnDragEnter() {
    setIsDragOver(true);
  }

  function handleOnDragLeave() {
    setIsDragOver(false);
  }

  const handleOnDrop = useCallback(() => {
    if (dragged) {
      removeFromList(dragged.status.name, dragged);
      const updatedTask: Task = {
        ...dragged,
        status: {
          ...dragged.status,
          name: label,
        },
      };
      set2List(label, updatedTask);
      setDragged();
    }
    setIsDragOver(false);
  }, [dragged, label, removeFromList, set2List, setDragged]);

  function handlePreventDefault(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div
      role="presentation"
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      onDragOver={handlePreventDefault}
      onDrop={handleOnDrop}
      tabIndex={-1}
      className={`flex flex-col py-2 px-4 gap-4 h-full rounded-3xl transition-colors ${className} ${isDragOver ? "bg-gray-500/30" : "bg-transparent"}`}
    >
      <span className="pl-4 text-lg font-bold">{label}</span>
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
    </div>
  );
};
