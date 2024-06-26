self.addEventListener("push", (event) => {
  const data = event.data.json();
  const options = {
    body: data.body,
    // icon: 'icon.png',
    // badge: 'badge.png'
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", function (event) {
  event.notification.close();
  event.waitUntil(
    clients.openWindow("https://notes-kweis-projects.vercel.app/spending"),
  );
});
