import { CtxTask } from "@/app/task/CtxTask";
import { TaskBoard } from "@/app/task/TaskBoard";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { ToolCtxProvider } from "@/app/task/ToolCtxProvider";
import { getServerSession } from "next-auth";

export const TaskBoardContainer = async () => {
  const session = await getServerSession();
  const email = session?.user?.email ?? "";
  if (email === "") return null;

  return (
    <CtxTask email={email}>
      <DraggableTask>
        <ToolCtxProvider>
          <ToolBox />
          <TaskBoard />
        </ToolCtxProvider>
      </DraggableTask>
    </CtxTask>
  );
};
