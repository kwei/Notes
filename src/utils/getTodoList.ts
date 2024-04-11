import { IMongoQuery, ITodo } from "@/type";

const BASE_URL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:3000"
    : "https://notes-kweis-projects.vercel.app";

export async function getTodoList(filter: Partial<ITodo>) {
  const res = await fetch(`${BASE_URL}/api/mongo/todo/task`, {
    method: "POST",
    body: JSON.stringify({
      method: "get",
      filter: filter,
    } as IMongoQuery<ITodo>),
  });
  return await res.json();
}
