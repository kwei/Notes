export const notify = (title: string, msg: string) => {
  if (!("Notification" in window)) {
    alert("這個瀏覽器目前不支援 Notification");
  } else if (Notification.permission === "granted") {
    new Notification(msg);
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((status) => {
      if (status === "granted") {
        new Notification(title, { body: msg });
      }
    });
  }
};

export const requestNotificationPermission = () => {
  if (!("Notification" in window)) {
    alert("這個瀏覽器目前不支援 Notification");
  } else {
    Notification.requestPermission().finally();
  }
};
