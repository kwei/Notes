import { Dashboard } from "@/app/task/v2/Dashboard";
import { TaskModalContext } from "@/app/task/v2/TaskModalContext";
import { TasksContext } from "@/app/task/v2/TasksContext";
import { IMongoQueryRes, ITodo } from "@/type";
import { getTodoList } from "@/utils/getTodoList";

export default async function Home() {
  const tasks = await getTasks();
  return (
    <main className="flex w-full flex-1 justify-center">
      <TasksContext tasks={tasks}>
        <TaskModalContext>
          <Dashboard />
        </TaskModalContext>
      </TasksContext>
    </main>
  );
}

const getTasks = async () => {
  return getTodoList({}).then((res: IMongoQueryRes) => {
    if (res.status) return JSON.parse(res.message) as ITodo[];
    return [];
  });
};
