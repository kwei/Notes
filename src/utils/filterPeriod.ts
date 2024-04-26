import { ITodo } from "@/type";

export const filterPeriod = (period: string, list: ITodo[]) => {
  const res = new Set<ITodo>([]);
  if (!list) return [];
  if (period === "") return list;
  const [startDate, endDate] = period.split(",");
  list.forEach((data) => {
    const left = data.iat ? new Date(data.iat).getTime() : -999999999999999;
    const right = data.expiry
      ? new Date(data.expiry).getTime()
      : 999999999999999;

    const start = startDate === "" ? 0 : new Date(startDate).getTime();
    const end = endDate === "" ? 0 : new Date(endDate).getTime();

    if ((start >= left && start <= right) || (end >= left && end <= right)) {
      res.add(data);
    }
  });
  return Array.from(res);
};
