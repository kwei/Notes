"use client";

export const register = () => {
  async function registerPeriodicSync() {
    const registration = await navigator.serviceWorker.ready;
    // Check if periodicSync is supported
    if ("periodicSync" in registration) {
      // Request permission
      const status = await navigator.permissions.query({
        name: "periodic-background-sync",
      });

      if (status.state === "granted") {
        try {
          await registration.periodicSync.register("periodic-notify", {
            minInterval: 1000,
          });
          registration.periodicSync.getTags().then((tags) => {
            if (tags.includes("periodic-notify")) {
              console.log("Periodic background sync registered!");
            }
          });
        } catch (e) {
          console.error(`Periodic background sync failed:\nx${e}`);
        }
      } else {
        console.info("Periodic background sync is not granted.");
      }
    } else {
      console.log("Periodic background sync is not supported.");
    }
  }

  if ("serviceWorker" in navigator) {
    // Register the service worker
    navigator.serviceWorker
      .register("/periodicNotifyServiceWorker.js", {
        scope: "/",
      })
      .then(() => {
        console.log("Register Service Worker.");
      });

    // Register the periodic background sync
    registerPeriodicSync().then();
  }
};
