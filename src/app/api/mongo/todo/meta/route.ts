import { MONGODB_LINE_USER_URI } from "@/app/api/mongo/constants";
import { MetaConfig, IMongoQuery, IMongoQueryRes } from "@/type";
import { NextResponse } from "next/server";
import { MongoClient } from "mongodb";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
  const doc = (await req.json()) as IMongoQuery<MetaConfig>;
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };
  try {
    await MONGODB_LINE_USER_CLIENT.connect();
    const db = MONGODB_LINE_USER_CLIENT.db("LineUser");
    const collections = db.collection("MetaConfig");
    const method = doc.method;
    if (method === "get") {
      // res = await retrieveData(collections, doc.filter);
    } else if (method === "set") {
      // res = await insertData(collections, doc.data);
    } else if (method === "update") {
      // res = await insertData(collections, doc.data);
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
