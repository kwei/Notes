import { IMongoQuery, ITodo } from "@/type";
import { BASE_URL } from "@/utils/constants";

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
