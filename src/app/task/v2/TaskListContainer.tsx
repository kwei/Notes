"use client";

import { TaskCard } from "@/app/task/v2/TaskCard";
import { useTaskContext } from "@/app/task/v2/TasksContext";
import { TASK_STATUS } from "@/utils/constants";
import { useMemo } from "react";
import { IoIosAdd } from "react-icons/io";

export const TaskListContainer = ({ type }: { type: TASK_STATUS }) => {
  const { tasks } = useTaskContext();

  const taskList = useMemo(() => tasks[type], [tasks, type]);

  const completeAmount = useMemo(
    () => taskList.filter((task) => task.complete === true).length,
    [taskList],
  );

  return (
    <div className="bg-gray-40-300 mx-1 flex h-full w-[260px] shrink-0 flex-col rounded-xl">
      <TaskListLabel
        title={type}
        completeAmount={completeAmount}
        totalAmount={taskList.length}
      />
      <div className="scrollbar group/task-list flex h-0 w-full flex-auto flex-col gap-2 overflow-y-auto p-2">
        {taskList.map((task, i) => (
          <TaskCard key={`${task.id}-${i.toString()}`} task={task} />
        ))}
        <AddNewTaskCardButton />
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

const AddNewTaskCardButton = () => {
  return (
    <button
      type="button"
      className="flex items-center justify-center rounded-md border border-dashed border-gray-500/30 p-2 text-gray-500 opacity-0 transition-all hover:border-solid hover:bg-gray-500/30 hover:text-gray-400 group-hover/task-list:opacity-100"
    >
      <IoIosAdd className="size-6" />
      <span>Add New Task</span>
    </button>
  );
};
