"use client";

import { Task } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { DragEvent, ReactNode, useRef, useState } from "react";

export const TaskContainer = ({
  className = "",
  label,
  children,
}: {
  className?: string;
  label: TASK_STATUS;
  children: ReactNode;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  function handleOnDragEnter() {
    setIsDragOver(true);
  }

  function handleOnDragLeave() {
    setIsDragOver(false);
  }

  function handleOnDrop(event: DragEvent<HTMLDivElement>) {
    const task = JSON.parse(event.dataTransfer.getData("task")) as Task;
    const updatedTask: Task = {
      ...task,
      status: {
        ...task.status,
        name: label,
      },
    };
    fetch("/api/notion/task", {
      method: "POST",
      body: JSON.stringify(updatedTask),
    })
      .then((res) => res.json())
      .then((res) => {
        console.log("update task: ", res);
      });
    setIsDragOver(false);
  }

  function handlePreventDefault(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
  }

  return (
    <div
      ref={ref}
      role="presentation"
      onDragEnter={handleOnDragEnter}
      onDragLeave={handleOnDragLeave}
      onDragOver={handlePreventDefault}
      onDrop={handleOnDrop}
      tabIndex={-1}
      className={`flex flex-col py-2 px-4 gap-4 h-full rounded-3xl transition-colors ${className} ${isDragOver ? "bg-gray-500/30" : "bg-transparent"}`}
    >
      <span className="pl-4 text-lg font-bold">{label}</span>
      {children}
    </div>
  );
};
