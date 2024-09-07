"use client";

import { useDraggableContext } from "@/app/task/v2/DraggableContext";
import { Tag } from "@/app/task/v2/Tag";
import { TaskCard } from "@/app/task/v2/TaskCard";
import { useTaskModalContext } from "@/app/task/v2/TaskModalContext";
import { useTaskContext } from "@/app/task/v2/TasksContext";
import { ITodo } from "@/type";
import { TASK_COLOR, TASK_STATUS } from "@/utils/constants";
import { updateTodo } from "@/utils/updateTodo";
import { useCallback, useMemo, DragEvent, useState } from "react";
import { IoIosAdd } from "react-icons/io";

export const TaskListContainer = ({ type }: { type: TASK_STATUS }) => {
  const { tasks, reFetch, loading } = useTaskContext();
  const { draggedItem, handleDragOver, handleDrop } = useDraggableContext();
  const [isDragOver, setIsDragOver] = useState(false);
  const [updating, setUpdating] = useState(false);

  const taskList = useMemo(() => tasks[type], [tasks, type]);

  const completeAmount = useMemo(
    () => taskList.filter((task) => task.complete === true).length,
    [taskList],
  );

  const onDragOver = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      handleDragOver(event);
      if (draggedItem && draggedItem.status.name !== type) {
        setIsDragOver(true);
      }
    },
    [draggedItem, handleDragOver, type],
  );

  const onDragLeave = () => {
    setIsDragOver(false);
  };

  const onDrop = useCallback(
    (event: DragEvent<HTMLDivElement>) => {
      handleDrop(event, async (data) => {
        if (data.status.name === type) return;
        setUpdating(true);
        await updateTodo(data, {
          ...data,
          status: { name: type },
        });
        reFetch().finally();
        setUpdating(false);
      });
    },
    [handleDrop, reFetch, type],
  );

  const droppedElementProps = useMemo(
    () => ({
      onDragOver,
      onDrop,
      onDragLeave,
    }),
    [onDragOver, onDrop],
  );

  return (
    <div
      {...droppedElementProps}
      className="mx-1 flex h-full w-[260px] shrink-0 flex-col rounded-xl bg-gray-40-300"
    >
      <TaskListLabel
        title={type}
        completeAmount={completeAmount}
        totalAmount={taskList.length}
      />
      <div className="scrollbar group/task-list flex h-0 w-full flex-auto flex-col gap-2 overflow-y-auto p-2">
        {loading ? (
          <>
            <LoadingCard hasTag />
            <LoadingCard />
            <LoadingCard />
          </>
        ) : (
          <>
            {taskList.map((task, i) => (
              <TaskCard
                key={`${task.id}-${i.toString()}`}
                task={task}
                updating={updating}
              />
            ))}
            {updating ? (
              <LoadingCard hasTag />
            ) : (
              isDragOver && draggedItem && <TaskCard task={draggedItem} />
            )}
            <AddNewTaskCardButton type={type} />
          </>
        )}
      </div>
    </div>
  );
};

const LoadingCard = ({ hasTag = false }: { hasTag?: boolean }) => {
  return (
    <div className="animate-pulse rounded bg-gray-40-500 px-2 py-3">
      <div className="invisible flex flex-col">
        <span className="text-start text-sm">title</span>
        <span className="text-xs text-gray-500">xxxx/xx/xx ~ xxxx/xx/xx</span>
        {hasTag && (
          <div className="flex flex-wrap items-center gap-1 pt-3 text-xs">
            <Tag
              tag={{
                name: "tag",
                color: TASK_COLOR.Gray,
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

const TaskListLabel = ({
  title,
  completeAmount,
  totalAmount,
}: {
  title: string;
  completeAmount: number;
  totalAmount: number;
}) => {
  return (
    <div className="flex w-full items-center gap-2 p-2 pl-4">
      <span className="text-lg font-bold">{title}</span>
      <span className="text-xs font-bold text-gray-500">
        {completeAmount}/{totalAmount}
      </span>
    </div>
  );
};

const AddNewTaskCardButton = ({ type }: { type: TASK_STATUS }) => {
  const { setTask } = useTaskModalContext();
  const { getUser } = useTaskContext();

  const defaultTask: ITodo = {
    title: "",
    status: {
      name: type,
    },
    tags: [],
    detail: "",
    userEmail: getUser().email,
  };

  return (
    <button
      type="button"
      onClick={() => setTask(defaultTask)}
      className="flex items-center justify-center rounded-md border border-dashed border-gray-500/30 p-2 text-gray-500 opacity-0 transition-all hover:border-solid hover:bg-gray-500/30 hover:text-gray-400 group-hover/task-list:opacity-100"
    >
      <IoIosAdd className="size-6" />
      <span>Add New Task</span>
    </button>
  );
};
