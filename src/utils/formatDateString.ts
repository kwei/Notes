export function formatDateString(date: Date | string) {
  const day = ("0" + new Date(date).getDate()).slice(-2);
  const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
  return `${new Date(date).getFullYear()}-${month}-${day}`;
}
