import { MONGODB_SPENDING_URI } from "@/app/api/mongo/constants";
import { ISubscription } from "@/type";
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

export async function POST() {
  console.log("Remind to take spending record.");
  const MONGODB_SPENDING_CLIENT = new MongoClient(MONGODB_SPENDING_URI);

  if (vapidKeys.publicKey && vapidKeys.privateKey) {
    console.log("web-push set vapid details.");
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
    const res = await retrieveData(collections, {});
    if (res.status && res.message) {
      const data = JSON.parse(res.message) as {
        subscription: ISubscription;
        profile: {
          browser: string;
          device: string;
          email: string;
        };
      }[];
      console.log("[Subscriptions] ", data.length);
      const subscriptions = data.map((d) => d.subscription);
      const promiseList: Promise<webPush.SendResult>[] = [];
      subscriptions.forEach((subscription) => {
        if (subscription) {
          promiseList.push(
            webPush.sendNotification(subscription, JSON.stringify(options)),
          );
        }
      });
      await Promise.all(promiseList);
      return NextResponse.json({
        status: true,
      });
    }
  } catch (e) {
    return NextResponse.json({
      status: false,
      message: JSON.stringify(e),
    });
  }
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
