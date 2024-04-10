import { IMongoQuery, IUser } from "@/type";

export async function getUserData(filter: Partial<IUser>) {
  const res = await fetch("/api/mongo/user", {
    method: "POST",
    body: JSON.stringify({
      method: "get",
      filter: filter,
    } as IMongoQuery),
  });
  return await res.json();
}
