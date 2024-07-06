"use client";
import { IRecord } from "@/type";
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useMemo } from "react";

interface Props {
  list: IRecord[];
  loading: boolean;
}

const MONTHS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

export const BarChartByMonth = (props: Props) => {
  const { list, loading } = props;

  const totalOutcomeByMonth = useMemo(() => {
    const res: number[] = [];

    const map: IRecord[][] = [];
    MONTHS.forEach(() => {
      map.push([]);
    });
    list.forEach((data) => {
      const month = data.date.split("-")[1];
      if (data.price < 0) {
        map[Number(month) - 1].push(data);
      }
    });

    map.forEach((recordList) => {
      const value = recordList.reduce((sum = 0, item) => sum + item.price, 0);
      res.push(-value);
    });
    return res;
  }, [list]);

  const totalIncomeByMonth = useMemo(() => {
    const res: number[] = [];

    const map: IRecord[][] = [];
    MONTHS.forEach(() => {
      map.push([]);
    });
    list.forEach((data) => {
      const month = data.date.split("-")[1];
      if (data.price >= 0) {
        map[Number(month) - 1].push(data);
      }
    });

    map.forEach((recordList) => {
      const value = recordList.reduce((sum = 0, item) => sum + item.price, 0);
      res.push(value);
    });
    return res;
  }, [list]);

  return (
    <BarChart
      sx={{
        [`.${axisClasses.root}`]: {
          [`.${axisClasses.tick}, .${axisClasses.line}`]: {
            stroke: "#D0D0D0",
          },
          [`.${axisClasses.tickLabel}`]: {
            fill: "#D0D0D0",
          },
        },
      }}
      series={[
        { data: totalOutcomeByMonth, label: "支出", id: "outcome" },
        { data: totalIncomeByMonth, label: "收入", id: "income" },
      ]}
      xAxis={[
        {
          data: MONTHS.map((v) => `${v}月`),
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
      colors={["#FF5436", "#50E3C2"]}
      loading={loading}
    />
  );
};
