import { IMongoQuery, IMongoQueryRes, IGroupRecord } from "@/type";
import { BASE_URL } from "@/utils/constants";

export const updateGroupSpend = async (
  filter: Partial<IGroupRecord>,
  data: IGroupRecord,
) => {
  const res = await fetch(`${BASE_URL}/api/mongo/spending/group`, {
    method: "POST",
    body: JSON.stringify({
      method: "update",
      filter,
      data,
    } as IMongoQuery<IGroupRecord>),
  });
  return (await res.json()) as IMongoQueryRes;
};
