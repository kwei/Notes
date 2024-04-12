import { MONGODB_LINE_USER_URI } from "@/app/api/mongo/constants";
import { IUser, IMongoQuery, IMongoQueryRes } from "@/type";
import { NextResponse } from "next/server";
import { Collection, MongoClient } from "mongodb";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
  const doc = (await req.json()) as IMongoQuery<IUser>;
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };
  try {
    await MONGODB_LINE_USER_CLIENT.connect();
    const db = MONGODB_LINE_USER_CLIENT.db("LineUser");
    const collections = db.collection("BasicInfo");
    const method = doc.method;
    if (method === "get") {
      res = await retrieveData(collections, doc.filter);
    } else if (method === "set") {
      res = await insertData(collections, doc.data);
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

async function retrieveData(collections: Collection, filter: Partial<IUser>) {
  const res = await collections.find(filter).toArray();
  if (res.length === 1) {
    return {
      status: true,
      message: JSON.stringify(res[0]),
    };
  } else if (res.length > 1) {
    return {
      status: false,
      message: "More than one data",
    };
  } else {
    return {
      status: false,
      message: "No data",
    };
  }
}

async function insertData(collections: Collection, data: IUser) {
  const res = await collections.insertOne(data);
  return {
    status: true,
    message: JSON.stringify(res),
  };
}
