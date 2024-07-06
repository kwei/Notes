"use client";
import { MonthSelector } from "@/app/spending/MonthSelector";
import { Record } from "@/app/spending/Record";
import {
  useRecordCtx,
  useRecordHandlerCtx,
} from "@/app/spending/RecordContextProvider";
import { IRecord } from "@/type";
import { useMemo, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export const RecordList = () => {
  const { list, loading } = useRecordCtx();
  const [currentDate, setCurrentDate] = useState(
    `${new Date().getFullYear()}-${(new Date().getMonth() + 1).toString().padStart(2, "0")}`,
  );
  const [chartType, setChartType] = useState(true);
  const { filterByMonth } = useRecordHandlerCtx();
  const { outcome, income } = filterByMonth(currentDate);

  const filteredList = useMemo(
    () =>
      list.filter(
        (data) =>
          currentDate === "" ||
          currentDate === data.date.split("-").slice(0, 2).join("-"),
      ),
    [currentDate, list],
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

  const recordMap = useMemo(() => {
    return chartType ? outcomeRecordMap : incomeRecordMap;
  }, [chartType, incomeRecordMap, outcomeRecordMap]);

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

  if (loading) {
    return (
      <div className="m-auto">
        <div className="loader-square"></div>
      </div>
    );
  } else if (list.length === 0) {
    return (
      <div className="flex w-full items-center justify-center">
        <span className="text-xl">查無資料</span>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-1">
      <div className="mb-8 flex w-full items-center justify-center border-b-2 border-solid border-stone-500">
        <span className="pb-4 text-2xl font-bold">月度回顧</span>
      </div>
      <MonthSelector onChange={setCurrentDate} />
      <div className="flex w-full flex-col items-center gap-4 p-2">
        <div className="flex items-center gap-2">
          <button
            className={`border border-solid border-stone-500 px-1 font-bold transition-colors ${chartType ? "bg-stone-400 text-gray-800" : "text-gray-d0-500 hover:bg-stone-400 hover:text-gray-800"}`}
            onClick={() => setChartType(true)}
          >
            支出
          </button>
          <button
            className={`border border-solid border-stone-500 px-1 font-bold transition-colors ${chartType ? "text-gray-d0-500 hover:bg-stone-400 hover:text-gray-800" : "bg-stone-400 text-gray-800"}`}
            onClick={() => setChartType(false)}
          >
            收入
          </button>
        </div>
        <div
          className={`relative h-[150px] ${filteredList.length > 0 ? "block" : "hidden"}`}
        >
          <PieChart
            series={[
              {
                data: chartType
                  ? totalOutcomeByCategory
                  : totalIncomeByCategory,
                innerRadius: 40,
                outerRadius: 60,
                paddingAngle: 0,
                cornerRadius: 0,
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
            height={150}
          />
          <span className="absolute left-[90px] top-1/2 flex w-[75px] max-w-[75px] -translate-y-1/2 items-center justify-center">
            <span className="text-sm font-bold">
              $ {chartType ? -outcome : income}
            </span>
          </span>
        </div>
      </div>
      <div className="flex w-full flex-col items-center gap-2">
        {Object.keys(recordMap).map((key) => (
          <Record key={key} category={key} list={recordMap[key]} />
        ))}
      </div>
    </div>
  );
};
