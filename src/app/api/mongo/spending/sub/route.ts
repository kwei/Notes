import { MONGODB_SPENDING_URI } from "@/app/api/mongo/constants";
import { IMongoQuery, IMongoQueryRes, ISubscription } from "@/type";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_SPENDING_CLIENT = new MongoClient(MONGODB_SPENDING_URI);
  const doc = (await req.json()) as IMongoQuery<{
    subscription: ISubscription;
    email: string;
    profile: {
      browser: string;
      device: string;
    };
  }>;
  let res: IMongoQueryRes;
  try {
    await MONGODB_SPENDING_CLIENT.connect();
    const db = MONGODB_SPENDING_CLIENT.db("Spending");
    const collections = db.collection("Subscription");
    const method = doc.method;
    if (method === "set") {
      const old = await retrieveData(collections, doc.data.email);
      if (!old.status) {
        res = await insertData(collections, doc.data);
      } else {
        res = {
          status: false,
          message: "Already Have",
        };
      }
    } else if (method === "get") {
      res = await retrieveData(collections, doc.data.email);
    } else if (method === "delete") {
      res = await deleteData(collections, doc.data.email);
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

async function retrieveData(collections: Collection, email: string) {
  const res = await collections.find({ email }).toArray();
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

async function insertData(
  collections: Collection,
  data: {
    subscription: ISubscription;
    email: string;
    profile: {
      browser: string;
      device: string;
    };
  },
) {
  const res = await collections.insertOne(data);
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}

async function deleteData(collections: Collection, email: string) {
  const res = await collections.deleteOne({ email });
  return {
    status: res.acknowledged,
    message: JSON.stringify(res),
  };
}
