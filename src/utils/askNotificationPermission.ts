"use client";

export async function askNotificationPermission() {
  if (Notification.permission !== "granted") {
    const permissionResult = await new Promise((resolve) => {
      Notification.requestPermission((result) => {
        resolve(result);
      });
    });
    if (permissionResult !== "granted") {
      console.error("Permission not granted for Notification");
    }
  }
}
