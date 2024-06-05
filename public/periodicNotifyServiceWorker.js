class NotifyAgent {
  _notificationHours = [9, 13, 19, 22];
  _notificationWords = [
    "現在是早上9點，早餐吃了沒~~記得記帳喔!",
    "現在是下午1點，午餐應該吃完了吧!記得記帳喔~",
    "現在是晚上7點~晚餐吃飽也要記得記帳~",
    "歐鳩桑罵，It's time to go to bed. 不要忘了記帳喔! 呀咧呀咧",
  ];

  async start() {
    if (this.__checkTime())
      await this.__notify(
        this._notificationWords[
          this._notificationHours.indexOf(new Date().getHours())
        ],
      );
  }

  __checkTime() {
    return new Date().getHours() in this._notificationHours;
  }

  async __notify(wording) {
    await notify("提醒您記得記帳喔", {
      body: wording,
      // icon: "/images/icon.png",
      // badge: "/images/badge.png",
    });
  }
}

async function notify(title, options) {
  await self.registration.showNotification(title, options);
}

const notifyAgent = new NotifyAgent();

self.addEventListener("install", () => {
  console.log("start a timer");
  setInterval(
    () => {
      notifyAgent.start().then();
    },
    60 * 60 * 1000,
  );
});


self.addEventListener('sync', event => {
  if (event.tag === 'background-sync') {
    console.log("background sync");
    event.waitUntil(notifyAgent.start());
  }
});

self.addEventListener("periodicsync", (event) => {
  if (event.tag === "periodic-notify") {
    console.log("periodic sync");
    event.waitUntil(notifyAgent.start());
  }
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://notes-kweis-projects.vercel.app/spending"),
  );
});
