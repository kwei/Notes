import { TaskCard } from "@/app/task/TaskCard";
import { TaskContainer } from "@/app/task/TaskContainer";
import { Task } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { getTaskList } from "@/utils/getTaskList";

export const TaskBoard = async () => {
  const taskList = await getTaskList();

  const taskTable: Record<TASK_STATUS, Task[]> = {
    [TASK_STATUS.BACKLOG]: [],
    [TASK_STATUS.NEW_REQUEST]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.COMPLETE]: [],
  };

  taskList.forEach((task) => {
    taskTable[task.status.name].push(task);
  });

  return (
    <div className="w-full h-full flex-1 grid grid-cols-4 gap-4 mt-8">
      <TaskContainer label={TASK_STATUS.BACKLOG} className="col-span-1">
        {taskTable[TASK_STATUS.BACKLOG].map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TaskContainer>
      <TaskContainer label={TASK_STATUS.NEW_REQUEST} className="col-span-1">
        {taskTable[TASK_STATUS.NEW_REQUEST].map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TaskContainer>
      <TaskContainer label={TASK_STATUS.IN_PROGRESS} className="col-span-1">
        {taskTable[TASK_STATUS.IN_PROGRESS].map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TaskContainer>
      <TaskContainer label={TASK_STATUS.COMPLETE} className="col-span-1">
        {taskTable[TASK_STATUS.COMPLETE].map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </TaskContainer>
    </div>
  );
};
