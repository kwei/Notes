import { IMongoQuery, ITodo } from "@/type";

export async function setTodo(data: ITodo) {
  const res = await fetch("/api/mongo/todo/task", {
    method: "POST",
    body: JSON.stringify({
      method: "set",
      data,
    } as IMongoQuery<ITodo>),
  });
  return await res.json();
}
