import { IGroupRecord, IMongoQuery, IMongoQueryRes } from "@/type";
import { BASE_URL } from "@/utils/constants";

export async function setGroupSpend(data: IGroupRecord) {
  const res = await fetch(`${BASE_URL}/api/mongo/spending/group`, {
    method: "POST",
    body: JSON.stringify({
      method: "set",
      data,
    } as IMongoQuery<IGroupRecord>),
  });
  return (await res.json()) as IMongoQueryRes;
}
