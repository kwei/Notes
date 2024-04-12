"use client";

import { TaskContainer } from "@/app/task/TaskContainer";
import { TaskCard } from "@/app/task/TaskCard";
import { TASK_STATUS, TASK_TABLE } from "@/utils/constants";

export const Board = () => {
  return (
    <div className="w-full h-full flex-1 flex overflow-x-auto">
      <div className="flex-1 grid grid-cols-4 gap-2 min-w-[1000px] bg-gray-800 px-3 pb-3 rounded-b-3xl">
        {Object.keys(TASK_TABLE).map((label) => (
          <TaskContainer
            key={label}
            label={label as TASK_STATUS}
            className="col-span-1"
          >
            {(taskList) =>
              taskList.map((task) => (
                <TaskCard key={`label-${task.id}`} task={task} />
              ))
            }
          </TaskContainer>
        ))}
      </div>
    </div>
  );
};
