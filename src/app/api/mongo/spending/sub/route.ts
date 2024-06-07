import { MONGODB_SPENDING_URI } from "@/app/api/mongo/constants";
import { IMongoQuery, IMongoQueryRes, ISubscription } from "@/type";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_SPENDING_CLIENT = new MongoClient(MONGODB_SPENDING_URI);
  const doc = (await req.json()) as IMongoQuery<{
    subscription: ISubscription;
    userAgent: string;
  }>;
  let res: IMongoQueryRes;
  try {
    await MONGODB_SPENDING_CLIENT.connect();
    const db = MONGODB_SPENDING_CLIENT.db("Spending");
    const collections = db.collection("Subscription");
    const method = doc.method;
    if (method === "set") {
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
    await MONGODB_SPENDING_CLIENT.close();
  }

  return NextResponse.json(res);
}

async function insertData(
  collections: Collection,
  data: {
    subscription: ISubscription;
    userAgent: string;
  },
) {
  const res = await collections.insertOne(data);
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}
