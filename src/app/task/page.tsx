import { TaskBoard } from "@/app/task/TaskBoard";
import { ToolBox } from "@/app/task/ToolBox";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col md:p-4 p-8">
      <ToolBox />
      <TaskBoard />
    </main>
  );
}
