"use client";
import { BarChartByCategory } from "@/app/spending/BarChartByCategory";
import { BarChartByMonth } from "@/app/spending/BarChartByMonth";
import { useRecordCtx } from "@/app/spending/RecordContextProvider";
import { YearSelector } from "@/app/spending/YearSelector";
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

  return (
    <div className="flex w-full flex-1 flex-col gap-1">
      <div className="mb-8 flex w-full items-center justify-center border-b-2 border-solid border-stone-500">
        <span className="pb-4 text-2xl font-bold">年度回顧</span>
      </div>
      <YearSelector onChange={setCurrentYear} />
      <div className="flex w-full flex-col items-center gap-4 p-2">
        <span className="w-full text-center text-xl font-bold">
          每月收支長條圖
        </span>
        <BarChartByMonth list={filteredList} loading={loading} />

        <span className="w-full text-center text-xl font-bold">
          類別收支長條圖
        </span>
        <BarChartByCategory list={filteredList} loading={loading} />
      </div>
    </div>
  );
};
