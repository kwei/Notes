"use client";
import { Record } from "@/app/spending/Record";
import { IRecord } from "@/type";
import { BarChart } from "@mui/x-charts";
import { axisClasses } from "@mui/x-charts/ChartsAxis";
import { useCallback, useEffect, useMemo, useState } from "react";

interface Props {
  list: IRecord[];
  loading: boolean;
}

export const BarChartByCategory = (props: Props) => {
  const { list, loading } = props;
  const [categories, setCategories] = useState<Set<string>>(new Set([]));
  const [map, setMap] = useState<Record<string, IRecord[]>>({});

  const prepareMap = useCallback(() => {
    const _map: Record<string, IRecord[]> = {};
    list.forEach((data) => {
      if (!_map[data.category]) {
        _map[data.category] = [];
      }
      _map[data.category].push(data);
      setCategories((prevState) => prevState.add(data.category));
    });
    setMap(_map);
  }, [list]);

  const totalOutcomeByCategory = useMemo(() => {
    const res: number[] = [];
    categories.forEach((category) => {
      const value = map[category].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      if (value < 0) {
        res.push(-value);
      } else {
        res.push(0);
      }
    });
    return res;
  }, [categories, map]);

  const totalIncomeByCategory = useMemo(() => {
    const res: number[] = [];
    categories.forEach((category) => {
      const value = map[category].reduce(
        (sum = 0, item) => sum + item.price,
        0,
      );
      if (value >= 0) {
        res.push(value);
      } else {
        res.push(0);
      }
    });
    return res;
  }, [categories, map]);

  useEffect(() => {
    prepareMap();
  }, [prepareMap]);

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
        { data: totalOutcomeByCategory, label: "支出", id: "outcome" },
        { data: totalIncomeByCategory, label: "收入", id: "income" },
      ]}
      xAxis={[
        {
          data: Array.from(categories),
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
