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
      return {
        status: false,
        message: `Permission not granted.`,
      };
    } else if (permissionResult === "granted") {
      return {
        status: true,
        message: `Permission granted.`,
      };
    }
  }
  return {
    status: true,
    message: `Permission ${Notification.permission}.`,
  };
}
