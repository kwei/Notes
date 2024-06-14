"use client";
import { Record } from "@/app/spending/Record";
import { useRecordCtx } from "@/app/spending/RecordContextProvider";
import { YearSelector } from "@/app/spending/YearSelector";
import { IRecord } from "@/type";
import { BarChart } from "@mui/x-charts";
import { useMemo, useState } from "react";

export const YearlyRecordList = () => {
  const { list, loading } = useRecordCtx();
  const [currentYear, setCurrentYear] = useState("");

  const filteredList = useMemo(
    () =>
      list.filter(
        (data) => currentYear === "" || currentYear === data.date.split("-")[0],
      ),
    [currentYear, list],
  );

  const outcomeRecordMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    filteredList.forEach((data) => {
      if (data.price < 0) {
        if (!res[data.category]) {
          res[data.category] = [];
        }
        res[data.category].push(data);
      }
    });
    return res;
  }, [filteredList]);

  const incomeRecordMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    filteredList.forEach((data) => {
      if (data.price >= 0) {
        if (!res[data.category]) {
          res[data.category] = [];
        }
        res[data.category].push(data);
      }
    });
    return res;
  }, [filteredList]);

  const outcomeRecordMonthMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((num) => {
      res[num.toString().padStart(2, "0")] = [];
    });
    filteredList.forEach((data) => {
      const month = data.date.split("-")[1];
      if (data.price < 0) {
        res[month].push(data);
      }
    });
    return res;
  }, [filteredList]);

  const incomeRecordMonthMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].forEach((num) => {
      res[num.toString().padStart(2, "0")] = [];
    });
    filteredList.forEach((data) => {
      const month = data.date.split("-")[1];
      if (data.price >= 0) {
        res[month].push(data);
      }
    });
    return res;
  }, [filteredList]);

  const totalOutcomeByCategory = useMemo(() => {
    const res: {
      id: number;
      value: number;
      label: string;
    }[] = [];
    Object.keys(outcomeRecordMap).forEach((label, id) => {
      const value = outcomeRecordMap[label].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      res.push({
        id,
        value: -value,
        label,
      });
    });
    return res;
  }, [outcomeRecordMap]);

  const totalIncomeByCategory = useMemo(() => {
    const res: {
      id: number;
      value: number;
      label: string;
    }[] = [];
    Object.keys(incomeRecordMap).forEach((label, id) => {
      const value = incomeRecordMap[label].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      res.push({
        id,
        value: value,
        label,
      });
    });
    return res;
  }, [incomeRecordMap]);

  const totalOutcomeByMonth = useMemo(() => {
    const res: number[] = [];
    Object.keys(outcomeRecordMonthMap).forEach((label) => {
      const value = outcomeRecordMonthMap[label].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      res.push(value);
    });
    return res;
  }, [outcomeRecordMonthMap]);

  const totalIncomeByMonth = useMemo(() => {
    const res: number[] = [];
    Object.keys(incomeRecordMonthMap).forEach((label) => {
      const value = incomeRecordMonthMap[label].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      res.push(value);
    });
    return res;
  }, [incomeRecordMonthMap]);

  return (
    <div className="flex w-full flex-1 flex-col gap-1">
      <div className="mb-8 flex w-full items-center justify-center border-b-2 border-solid border-stone-500">
        <span className="pb-4 text-2xl font-bold">即將到來</span>
      </div>
      <YearSelector onChange={setCurrentYear} />
      <div className="flex w-full flex-col items-center gap-4 p-2">
        <BarChart
          series={[
            { data: totalOutcomeByMonth, label: "支出", id: "outcome" },
            { data: totalIncomeByMonth, label: "收入", id: "income" },
          ]}
          xAxis={[
            {
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
              scaleType: "band",
            },
          ]}
          slotProps={{
            legend: {
              labelStyle: {
                fontSize: 14,
                fill: "#D0D0D0",
              },
            },
          }}
          width={350}
          height={200}
        />
      </div>
    </div>
  );
};
