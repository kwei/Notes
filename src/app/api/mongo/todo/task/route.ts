import { MONGODB_LINE_USER_URI } from "@/app/api/mongo/constants";
import { IMongoQuery, IMongoQueryRes, ITodo, IUser } from "@/type";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
  const doc = (await req.json()) as IMongoQuery<ITodo>;
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };
  try {
    await MONGODB_LINE_USER_CLIENT.connect();
    const db = MONGODB_LINE_USER_CLIENT.db("Todo");
    const collections = db.collection("Task");
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
    await MONGODB_LINE_USER_CLIENT.close();
  }

  return NextResponse.json(res);
}

async function retrieveData(collections: Collection, filter: Partial<ITodo>) {
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

async function insertData(collections: Collection, data: ITodo) {
  const res = await collections.insertOne(data);
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

async function updateData(
  collections: Collection,
  filter: Partial<ITodo>,
  data: ITodo,
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

async function deleteData(collections: Collection, filter: Partial<ITodo>) {
  const res = await collections.deleteOne(formatQueryObj(filter));
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

function formatQueryObj(data: Partial<ITodo>): Partial<ITodo> {
  const newObj = JSON.parse(JSON.stringify(data)) as Partial<ITodo>;
  return {
    title: newObj.title,
    iat: newObj.iat,
    expiry: newObj.expiry,
    userEmail: newObj.userEmail,
    detail: newObj.detail,
    status: newObj.status,
    tags: newObj.tags,
    msgLog: newObj.msgLog,
    complete: newObj.complete,
  };
}
