import { IMongoQuery, ITodo } from "@/type";

export async function deleteTodo(filter: Partial<ITodo>) {
  const res = await fetch("/api/mongo/todo/task", {
    method: "POST",
    body: JSON.stringify({
      method: "delete",
      filter: filter,
    } as IMongoQuery<ITodo>),
  });
  return await res.json();
}
