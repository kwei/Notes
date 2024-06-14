self.onmessage = async function (event) {
  const { data } = event.data;
  data.sort(function (a, b) {
    const a_time = new Date(`${a.date}T${a.time}`).getTime();
    const b_time = new Date(`${b.date}T${b.time}`).getTime();
    return a_time - b_time;
  });
  self.postMessage({ data });
};
