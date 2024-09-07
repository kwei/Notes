import { Dashboard } from "@/app/task/v2/Dashboard";
import { TaskModalContext } from "@/app/task/v2/TaskModalContext";
import { TasksContext } from "@/app/task/v2/TasksContext";

export default async function Home() {
  return (
    <main className="flex w-full flex-1 justify-center">
      <TasksContext>
        <TaskModalContext>
          <Dashboard />
        </TaskModalContext>
      </TasksContext>
    </main>
  );
}
