import { IUser, IMongoQuery, IMongoQueryRes } from "@/type";
import { NextResponse } from "next/server";
import { Collection, MongoClient } from "mongodb";

const uri = `mongodb+srv://${process.env.MONGODB_USERNAME}:${process.env.MONGODB_PASSWORD}@lineuser.xn8zlvq.mongodb.net/?retryWrites=true&w=majority&appName=LineUser`;
const client = new MongoClient(uri);

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const doc = (await req.json()) as IMongoQuery;
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };
  try {
    await client.connect();
    const db = client.db("LineUser");
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
      message: e as string,
    };
  } finally {
    await client.close();
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

async function updateData(
  collections: Collection,
  filter: Partial<IUser>,
  data: IUser,
) {
  return {
    status: true,
    message: "",
  };
}

async function deleteData(collections: Collection, filter: Partial<IUser>) {
  return {
    status: true,
    message: "",
  };
}
