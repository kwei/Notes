import { IMongoQuery, IMongoQueryRes, IRecord } from "@/type";

export const updateSpendingRecord = async (
  filter: Partial<IRecord>,
  data: IRecord,
) => {
  const res = await fetch("/api/mongo/spending/record", {
    method: "POST",
    body: JSON.stringify({
      method: "update",
      filter,
      data,
    } as IMongoQuery<IRecord>),
  });
  return (await res.json()) as IMongoQueryRes;
};
