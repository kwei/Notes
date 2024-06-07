import { NextResponse } from "next/server";
import * as webPush from "web-push";

const vapidKeys = {
  publicKey:
    "BJD7INKx5OJF-WLVUa97uop53IaxgXnsBDABGjj_oGWvWOO2AClHOpRcaXvieX2o0HJinVzH1nTV-mjlyFjeLwo",
  privateKey: "SAf91F5x_btFMFWDuPidWXoowx9hrzkCzkLNNFpq_sE",
};

webPush.setVapidDetails(
  "mailto:a0979597291@gmail.com",
  vapidKeys.publicKey,
  vapidKeys.privateKey,
);

const options = {
  title: "Test Web Push",
  body: "Test Web Push...",
};

export async function POST(req: Request) {
  console.log("[POST] req url: ", req.url);

  // read all subscriptions
  const subscription = {
    endpoint:
      "https://fcm.googleapis.com/fcm/send/fwNbCkZtyr0:APA91bF-tttRSH0KBHuZ3lGehkd7kcNzWOfAVTKeXp4cYUURgq2bEkTkCtLQAvrzDZ7q_N7on0ved-Ss9SGLRYGm61D2rkmPe2R2EUnLn7s1y7Fwrjts2I-qM94SQINyJA4VBV5spTdy",
    expirationTime: null,
    keys: {
      p256dh:
        "BEClFpLV0UV65m9wtmPxLVN6kIUTrALuRlUANPySm3eSXXArabumm4aziX4tPYefRtDaGpqL8SxwyyJlc9BvJzA=",
      auth: "I4qBuGIBj1pUVbT4sQnHEg==",
    },
  };

  webPush.sendNotification(subscription, JSON.stringify(options)).then(res => {
    console.log("Send Notification: ", res);
  });

  return NextResponse.json({
    status: true,
    message: "",
  });
}
