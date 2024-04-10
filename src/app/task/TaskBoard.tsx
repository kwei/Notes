import { CtxTask } from "@/app/task/CtxTask";
import { Board } from "@/app/task/Board";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { Task } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { getTaskList } from "@/utils/getTaskList";

export const TaskBoard = async () => {
  const allTaskList = await getTaskList();

  const taskTable: Record<TASK_STATUS, Task[]> = {
    [TASK_STATUS.BACKLOG]: [],
    [TASK_STATUS.NEW_REQUEST]: [],
    [TASK_STATUS.IN_PROGRESS]: [],
    [TASK_STATUS.COMPLETE]: [],
  };

  allTaskList.forEach((task) => {
    taskTable[task.status.name].push(task);
  });

  return (
    <CtxTask contextValue={taskTable}>
      <ToolBox />
      <DraggableTask>
        <Board />
      </DraggableTask>
    </CtxTask>
  );
};
