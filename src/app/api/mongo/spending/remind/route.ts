import { NextResponse } from "next/server";
import * as webPush from "web-push";

const vapidKeys = {
  publicKey: process.env.VAPIDKEY_PUBLIC ?? "",
  privateKey: process.env.VAPIDKEY_PRIVATE ?? "",
};

const options = {
  title: "Test Web Push",
  body: "Test Web Push...",
};

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);

  if (vapidKeys.publicKey && vapidKeys.privateKey) {
    webPush.setVapidDetails(
      "mailto:a0979597291@gmail.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey,
    );

    // read all subscriptions
    const subscription = {
      endpoint: "",
      expirationTime: null,
      keys: {
        p256dh: "",
        auth: "",
      },
    };

    webPush
      .sendNotification(subscription, JSON.stringify(options))
      .then((res) => {
        console.log("Send Notification: ", res);
      });
  }

  return NextResponse.json({
    status: true,
    message: "",
  });
}
