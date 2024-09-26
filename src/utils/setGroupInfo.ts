import { IGroup, IMongoQuery, IMongoQueryRes } from "@/type";

export async function setGroupInfo(data: IGroup) {
  const res = await fetch("/api/mongo/group", {
    method: "POST",
    body: JSON.stringify({
      method: "set",
      data,
    } as IMongoQuery<IGroup>),
  });
  return await res.json() as IMongoQueryRes;
}
