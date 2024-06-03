"use client";
import { MonthSelector } from "@/app/spending/MonthSelector";
import { Record } from "@/app/spending/Record";
import { useRecordCtx } from "@/app/spending/RecordContextProvider";
import { IRecord } from "@/type";
import { useCallback, useMemo, useState } from "react";
import { PieChart } from "@mui/x-charts/PieChart";

export const RecordList = () => {
  const { list, loading } = useRecordCtx();
  const [currentMonth, setCurrentMonth] = useState("");
  const [chartType, setChartType] = useState(true);

  const filteredList = useMemo(
    () =>
      list.filter(
        (data) =>
          currentMonth === "" ||
          currentMonth === data.date.split("-").slice(0, 2).join("-"),
      ),
    [currentMonth, list],
  );

  const recordMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    filteredList.forEach((data) => {
      if (!res[data.category]) {
        res[data.category] = [];
      }
      res[data.category].push(data);
    });
    return res;
  }, [filteredList]);

  const getTotalByCategory = useCallback(() => {
    const res: {
      id: number;
      value: number;
      label: string;
    }[] = [];
    Object.entries(recordMap).forEach(([label, list], id) => {
      const value = list.reduce((sum = 0, item) => sum + item.price, 0);
      if (chartType && value < 0) {
        res.push({
          id,
          value: -value,
          label,
        });
      } else if (!chartType && value >= 0) {
        res.push({
          id,
          value: value,
          label,
        });
      }
    });
    return res;
  }, [chartType, recordMap]);

  if (loading) {
    return (
      <div className="m-auto">
        <div className="loader-square"></div>
      </div>
    );
  } else if (list.length === 0) {
    return (
      <div className="w-full flex items-center justify-center">
        <span className="text-xl">查無資料</span>
      </div>
    );
  }

  return (
    <div className="w-full flex-1 flex flex-col gap-1">
      <div className="w-full flex items-center justify-center border-b-2 border-solid border-stone-500 mb-8">
        <span className="text-2xl font-bold">月度回顧</span>
      </div>
      <MonthSelector onChange={setCurrentMonth} />
      <div className="w-full flex flex-col items-center gap-4 p-2">
        <div className="flex items-center gap-2">
          <button
            className={`font-bold border border-solid border-stone-500 px-1 transition-colors ${chartType ? "bg-stone-400 text-gray-800" : "text-gray-d0-500 hover:bg-stone-400 hover:text-gray-800"}`}
            onClick={() => setChartType(true)}
          >
            支出
          </button>
          <button
            className={`font-bold border border-solid border-stone-500 px-1 transition-colors ${chartType ? "text-gray-d0-500 hover:bg-stone-400 hover:text-gray-800" : "bg-stone-400 text-gray-800"}`}
            onClick={() => setChartType(false)}
          >
            收入
          </button>
        </div>
        <div className="h-[150px]">
          <PieChart
            series={[
              {
                data: getTotalByCategory(),
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
            width={400}
            height={150}
          />
        </div>
      </div>
      <div className="w-full h-[250px] flex flex-col items-center pr-2 gap-2 scrollbar scroll-smooth overflow-y-auto">
        {Object.entries(recordMap).map(([key, value]) => (
          <Record key={key} category={key} list={value} />
        ))}
      </div>
    </div>
  );
};
