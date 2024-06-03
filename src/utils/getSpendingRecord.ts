import { IMongoQuery, IMongoQueryRes, IRecord } from "@/type";
import { BASE_URL } from "@/utils/constants";

export const getSpendingRecord = async (filter: Partial<IRecord>) => {
  const res = await fetch(`${BASE_URL}/api/mongo/spending/record`, {
    method: "POST",
    body: JSON.stringify({
      method: "get",
      filter: filter,
    } as IMongoQuery<IRecord>),
  });
  return await res.json() as IMongoQueryRes;
};
