import { IMongoQuery, IMongoQueryRes, IRecord } from "@/type";

export async function deleteSpendingRecord(filter: Partial<IRecord>) {
	const res = await fetch("/api/mongo/spending/record", {
		method: "POST",
		body: JSON.stringify({
			method: "delete",
			filter,
		} as IMongoQuery<IRecord>),
	});
	return (await res.json()) as IMongoQueryRes;
}
