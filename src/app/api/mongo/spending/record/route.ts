import { MONGODB_SPENDING_URI } from "@/app/api/mongo/constants";
import { IMongoQuery, IMongoQueryRes, IRecord } from "@/type";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_SPENDING_CLIENT = new MongoClient(MONGODB_SPENDING_URI);
  const doc = (await req.json()) as IMongoQuery<IRecord>;
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };
  try {
    await MONGODB_SPENDING_CLIENT.connect();
    const db = MONGODB_SPENDING_CLIENT.db("Spending");
    const collections = db.collection("Record");
    const method = doc.method;
    if (method === "get") {
      res = await retrieveData(collections, doc.filter);
    } else if (method === "set") {
      res = await insertData(collections, doc.data);
    } else if (method === "update") {
      res = await updateData(collections, doc.filter, doc.data);
    } else if (method === "delete") {
      res = await deleteData(collections, doc.filter);
    } else {
      res = {
        status: false,
        message: "Method mismatch",
      };
    }
  } catch (e) {
    res = {
      status: false,
      message: JSON.stringify(e),
    };
  } finally {
    await MONGODB_SPENDING_CLIENT.close();
  }

  return NextResponse.json(res);
}

async function retrieveData(collections: Collection, filter: Partial<IRecord>) {
  const res = await collections.find(filter).toArray();
  if (res.length > 0) {
    return {
      status: true,
      message: JSON.stringify(res),
    };
  } else {
    return {
      status: false,
      message: "No data",
    };
  }
}

async function insertData(collections: Collection, data: IRecord) {
  const res = await collections.insertOne(data);
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

async function updateData(
  collections: Collection,
  filter: Partial<IRecord>,
  data: IRecord,
) {
  const newData = formatQueryObj(data);
  const res = await collections.updateOne(formatQueryObj(filter), {
    $set: newData,
  });
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

async function deleteData(collections: Collection, filter: Partial<IRecord>) {
  const res = await collections.deleteOne(formatQueryObj(filter));
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

function formatQueryObj(data: Partial<IRecord>): Partial<IRecord> {
  const newObj = JSON.parse(JSON.stringify(data)) as Partial<IRecord>;
  return {
    id: newObj.id,
    price: newObj.price,
    desc: newObj.desc,
    category: newObj.category,
    date: newObj.date,
    time: newObj.time,
    email: newObj.email,
  };
}
