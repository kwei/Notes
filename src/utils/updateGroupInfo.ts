import { IGroup, IMongoQuery, IMongoQueryRes } from "@/type";

export async function updateGroupInfo(groupId: string, data: IGroup) {
  const res = await fetch("/api/mongo/group", {
    method: "POST",
    body: JSON.stringify({
      method: "update",
      filter: { groupId },
      data,
    } as IMongoQuery<IGroup>),
  });
  return await res.json() as IMongoQueryRes;
}
