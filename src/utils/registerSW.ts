"use client";

const applicationServerPublicKey =
  "BJD7INKx5OJF-WLVUa97uop53IaxgXnsBDABGjj_oGWvWOO2AClHOpRcaXvieX2o0HJinVzH1nTV-mjlyFjeLwo";

export const register = async () => {
  if ("serviceWorker" in navigator) {
    return navigator.serviceWorker
      .register("/receiveNotificationSW.js", {
        scope: "/",
      })
      .then((reg) => {
        console.log("[OK] Registered Service Worker.");
        return subscribeUser(reg);
      })
      .catch((e) => {
        console.error("[FAIL] Registered Service Worker.", e);
        return {
          status: false,
          data: null,
        };
      });
  } else {
    console.log("[NOT-SUPPORT] Service Worker.");
    return {
      status: false,
      data: null,
    };
  }
};

function urlB64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

async function subscribeUser(swRegistration: ServiceWorkerRegistration) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  let res: {
    status: boolean;
    data: PushSubscription | null;
  } = {
    status: false,
    data: null,
  };
  await swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then(async (subscription) => {
      console.log("User is subscribed", subscription);
      res = {
        status: true,
        data: subscription,
      };
    })
    .catch((err) => {
      console.log("Failed to subscribe the user: ", err);
      res = {
        status: false,
        data: null,
      };
    });
  return res;
}
