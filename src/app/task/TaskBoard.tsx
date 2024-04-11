import { CtxTask } from "@/app/task/CtxTask";
import { Board } from "@/app/task/Board";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { IMongoQueryRes, ITodo, IUser } from "@/type";
import { TASK_STATUS } from "@/utils/constants";
import { getTodoList } from "@/utils/getTodoList";

export const TaskBoard = async ({ user }: { user: IUser }) => {
  const allTaskList = await getTodoList({
    userEmail: user.email,
  }).then((res: IMongoQueryRes) => {
    if (res.status) return JSON.parse(res.message) as ITodo[];
    return [];
  });

  const taskTable: Record<TASK_STATUS, ITodo[]> = {
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
      <DraggableTask>
        <ToolBox />
        <Board />
      </DraggableTask>
    </CtxTask>
  );
};
