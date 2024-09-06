import { format } from "date-fns";

export function formatPeriod(iat?: Date, expiry?: Date) {
  if (!iat && !expiry) return "static";
  let startDate = "";
  let endDate = "";
  if (iat) startDate = format(new Date(iat), "yyyy/MM/dd");
  if (expiry) endDate = format(new Date(expiry), "yyyy/MM/dd");
  return `${startDate} ~ ${endDate}`;
}
