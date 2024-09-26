import { IMongoQuery, IMongoQueryRes, IGroupRecord } from "@/type";
import { BASE_URL } from "@/utils/constants";

export const getGroupSpend = async (filter: Partial<IGroupRecord>) => {
  const res = await fetch(`${BASE_URL}/api/mongo/spending/group`, {
    method: "POST",
    body: JSON.stringify({
      method: "get",
      filter: filter,
    } as IMongoQuery<IGroupRecord>),
  });
  return (await res.json()) as IMongoQueryRes;
};
