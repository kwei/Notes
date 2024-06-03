import { IMongoQuery, IMongoQueryRes, IRecord } from "@/type";

export async function setSpendingRecord(data: IRecord) {
  const res = await fetch("/api/mongo/spending/record", {
    method: "POST",
    body: JSON.stringify({
      method: "set",
      data,
    } as IMongoQuery<IRecord>),
  });
  return (await res.json()) as IMongoQueryRes;
}
