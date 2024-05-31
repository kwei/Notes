export async function askNotificationPermission() {
  const permissionResult = await new Promise((resolve) => {
    Notification.requestPermission((result) => {
      resolve(result);
    });
  });
  if (permissionResult !== "granted") {
    console.error("Permission not granted for Notification");
  }
}
