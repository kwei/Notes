import { TaskBoard } from "@/app/task/TaskBoard";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { ToolCtxProvider } from "@/app/task/ToolCtxProvider";

export const TaskBoardContainer = async () => {
  return (
    <DraggableTask>
      <ToolCtxProvider>
        <ToolBox />
        <TaskBoard />
      </ToolCtxProvider>
    </DraggableTask>
  );
};
