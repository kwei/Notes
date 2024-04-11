import { IMongoQuery, ITodo } from "@/type";

export async function updateTodo(filter: Partial<ITodo>, data: ITodo) {
  const res = await fetch("/api/mongo/todo/task", {
    method: "POST",
    body: JSON.stringify({
      method: "update",
      filter: filter,
      data,
    } as IMongoQuery<ITodo>),
  });
  return await res.json();
}
