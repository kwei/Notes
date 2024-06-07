"use client";

const applicationServerPublicKey =
  "BJD7INKx5OJF-WLVUa97uop53IaxgXnsBDABGjj_oGWvWOO2AClHOpRcaXvieX2o0HJinVzH1nTV-mjlyFjeLwo";

export const register = () => {
  // currently no use
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/receiveNotificationSW.js", {
        scope: "/",
      })
      .then((reg) => {
        subscribeUser(reg);
        console.log("[OK] Registered Service Worker.");
      })
      .catch((e) => {
        console.error("[FAIL] Registered Service Worker.", e);
      });
  } else {
    console.log("[NOT-SUPPORT] Service Worker.");
  }
};

function urlB64ToUint8Array(base64String) {
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

function subscribeUser(swRegistration) {
  const applicationServerKey = urlB64ToUint8Array(applicationServerPublicKey);
  swRegistration.pushManager
    .subscribe({
      userVisibleOnly: true,
      applicationServerKey: applicationServerKey,
    })
    .then((subscription) => {
      console.log("User is subscribed");
      fetch("/api/mongo/spending/sub", {
        method: "POST",
        body: JSON.stringify({
          method: "set",
          data: { subscription, userAgent: window.navigator.userAgent },
        }),
      }).then();
    })
    .catch((err) => {
      console.log("Failed to subscribe the user: ", err);
    });
}
