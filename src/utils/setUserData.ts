import { IUser, IMongoQuery } from "@/type";

export async function setUserData(data: IUser) {
  const res = await fetch("/api/mongo/user", {
    method: "POST",
    body: JSON.stringify({
      method: "set",
      data: data,
    } as IMongoQuery<IUser>),
  });
  return await res.json();
}
