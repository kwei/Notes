import { MONGODB_LINE_USER_URI } from "@/app/api/mongo/constants";
import { IGroup, IMongoQuery, IMongoQueryRes, IUser } from "@/type";
import { NextResponse } from "next/server";
import { Collection, MongoClient } from "mongodb";

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_LINE_USER_CLIENT = new MongoClient(MONGODB_LINE_USER_URI);
  const doc = (await req.json()) as IMongoQuery<IGroup>;
  let res: IMongoQueryRes;
  try {
    await MONGODB_LINE_USER_CLIENT.connect();
    const db = MONGODB_LINE_USER_CLIENT.db("Group");
    const collections = db.collection("Member");
    const method = doc.method;
    if (method === "get") {
      res = await retrieveData(collections, doc.filter);
    } else if (method === "set") {
      res = await insertData(collections, doc.data);
    } else if (method === "update") {
      res = await updateData(collections, doc.filter, doc.data);
    } else if (method === "delete") {
      res = await deleteData(collections, doc.data);
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

async function retrieveData(collections: Collection, filter: Partial<IGroup>) {
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

async function insertData(collections: Collection, data: IGroup) {
  const res = await collections.insertOne(data);
  return {
    status: true,
    message: JSON.stringify(res),
  };
}

async function updateData(
  collections: Collection,
  filter: Partial<IGroup>,
  data: IGroup,
) {
  const newData = formatQueryObj(data);
  const res = await collections.updateOne(formatQueryObj(filter), {
    $set: newData,
  });
  return {
    status: true,
    message: JSON.stringify(res),
  };
}

async function deleteData(collections: Collection, filter: Partial<IGroup>) {
  const res = await collections.deleteOne(filter);
  return {
    status: true,
    message: JSON.stringify(res),
  };
}

function formatQueryObj(data: Partial<IGroup>): Partial<IGroup> {
  const newObj = JSON.parse(JSON.stringify(data)) as Partial<IGroup>;
  return {
    groupId: newObj.groupId,
    name: newObj.name,
    owner: newObj.owner,
    members: newObj.members,
  };
}
