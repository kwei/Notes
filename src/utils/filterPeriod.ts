import { ITodo } from "@/type";

export const filterPeriod = (period: string, list: ITodo[]) => {
  const res: ITodo[] = [];
  if (period === "") return list;
  const [startDate, endDate] = period.split(",");
  list.forEach((data) => {
    if (
      (!data.iat ||
        startDate === "" ||
        new Date(data.iat).getTime() >= new Date(startDate).getTime()) &&
      (!data.expiry ||
        endDate === "" ||
        new Date(data.expiry).getTime() <= new Date(endDate).getTime())
    ) {
      if (!res.some((d) => d.id === data.id)) {
        res.push(data);
      }
    }
  });
  return res;
};
