import { IGroup, IMongoQuery, IMongoQueryRes } from "@/type";

export async function deleteGroupInfo(groupId: string) {
  const res = await fetch("/api/mongo/group", {
    method: "POST",
    body: JSON.stringify({
      method: "delete",
      filter: { groupId },
    } as IMongoQuery<IGroup>),
  });
  return await res.json() as IMongoQueryRes;
}
