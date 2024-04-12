import { CtxTask } from "@/app/task/CtxTask";
import { Board } from "@/app/task/Board";
import { ToolBox } from "@/app/task/ToolBox";
import { DraggableTask } from "@/app/task/DraggableTask";
import { getServerSession } from "next-auth";

export const TaskBoard = async () => {
  const session = await getServerSession();
  const email = session?.user?.email ?? "";
  if (email === "") return null;

  return (
    <CtxTask email={email}>
      <DraggableTask>
        <ToolBox />
        <Board />
      </DraggableTask>
    </CtxTask>
  );
};
