import { useRecordCtx } from "@/app/spending/RecordContextProvider";
import { IRecord } from "@/type";
import { useMemo } from "react";

export const RecordList = () => {
  const { list } = useRecordCtx();

  const recordMap = useMemo(() => {
    const res: Record<string, IRecord[]> = {};
    list.forEach((data) => {
      if (!res[data.category]) {
        res[data.category] = [];
      }
      res[data.category].push(data);
    });
    return res;
  }, [list]);

  return <div></div>;
};
