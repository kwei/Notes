"use client";

export const register = () => {
  // currently no use
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/receiveNotificationSW.js", {
        scope: "/",
      })
      .then(() => {
        console.log("[OK] Registered Service Worker.");
      })
      .catch((e) => {
        console.error("[FAIL] Registered Service Worker.", e);
      });
  } else {
    console.log("[NOT-SUPPORT] Service Worker.");
  }
};
