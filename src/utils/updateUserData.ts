import { IMongoQuery, IMongoQueryRes, IUser } from "@/type";

export async function updateUserData(filter: Partial<IUser>, data: IUser) {
  const res = await fetch("/api/mongo/user", {
    method: "POST",
    body: JSON.stringify({
      method: "update",
      filter,
      data: data,
    } as IMongoQuery<IUser>),
  });
  return (await res.json()) as IMongoQueryRes;
}
