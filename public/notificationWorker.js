let interval = null;

self.onmessage = (event) => {
  if (!event.data) return;
  const taskTable = JSON.parse(event.data);
  if (interval) clearInterval(interval);
  try {
    interval = setInterval(() => {
      lookup(taskTable);
    }, 1000);
  } catch (e) {
    if (interval) clearInterval(interval);
    console.log(e);
  }
};

function lookup(taskTable) {
  const res = [];
  Object.values(taskTable).forEach((taskList) => {
    taskList.forEach((task) => {
      if (
        task.expiry &&
        new Date().getDate() <= new Date(task.expiry).getDate() &&
        new Date(task.expiry).getDate() - new Date().getDate() === 1
      ) {
        res.push(task);
      }
    });
  });
  if (res.length > 0) {
    self.postMessage(JSON.stringify(res));
  }
}
