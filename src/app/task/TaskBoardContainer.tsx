import { TaskBoard } from "@/app/task/TaskBoard";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { ToolCtxProvider } from "@/app/task/ToolCtxProvider";

export const TaskBoardContainer = async () => {
  return (
    <DraggableTask>
      <ToolCtxProvider>
        <div className="flex w-full flex-1 flex-col items-center max-w-[1480px] bg-gray-800 xl:rounded-3xl rounded-b-none p-5 gap-3">
          <ToolBox />
          <TaskBoard />
        </div>
      </ToolCtxProvider>
    </DraggableTask>
  );
};
