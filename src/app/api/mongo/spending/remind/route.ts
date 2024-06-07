import { MONGODB_SPENDING_URI } from "@/app/api/mongo/constants";
import { IMongoQueryRes, ISubscription } from "@/type";
import { Collection, MongoClient } from "mongodb";
import { NextResponse } from "next/server";
import * as webPush from "web-push";

const vapidKeys = {
  publicKey: process.env.VAPIDKEY_PUBLIC ?? "",
  privateKey: process.env.VAPIDKEY_PRIVATE ?? "",
};

const options = {
  title: "KW Page",
  body: "提醒你，記得記帳喔!",
};

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);
  const MONGODB_SPENDING_CLIENT = new MongoClient(MONGODB_SPENDING_URI);
  let res: IMongoQueryRes = {
    status: true,
    message: "",
  };

  if (vapidKeys.publicKey && vapidKeys.privateKey) {
    webPush.setVapidDetails(
      "mailto:a0979597291@gmail.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey,
    );
  }

  try {
    await MONGODB_SPENDING_CLIENT.connect();
    const db = MONGODB_SPENDING_CLIENT.db("Spending");
    const collections = db.collection("Subscription");
    res = await retrieveData(collections, {});
  } catch (e) {
    res = {
      status: false,
      message: JSON.stringify(e),
    };
  }

  if (res.status && res.message) {
    const subscriptions = (JSON.parse(res.message) as ISubscription[]).map(
      (d) => ({
        endpoint: d.endpoint,
        expirationTime: null,
        keys: {
          p256dh: d.p256dh,
          auth: d.auth,
        },
      }),
    );
    subscriptions.forEach((subscription) => {
      webPush.sendNotification(subscription, JSON.stringify(options)).then();
    });
  }

  return NextResponse.json(res);
}

async function retrieveData(
  collections: Collection,
  filter: Partial<ISubscription>,
) {
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
