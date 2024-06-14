"use client";
import { Dashboard } from "@/app/spending/Dashboard";
import { RecordList } from "@/app/spending/RecordList";
import { YearlyRecordList } from "@/app/spending/YearlyRecordList";
import { useGetHash } from "@/hooks/useGetHash";
import { SPENDING_PAGE_TAB } from "@/utils/constants";

export const TabSelector = () => {
  const tab = useGetHash();
  if (tab === SPENDING_PAGE_TAB.DEFAULT) {
    return <Dashboard />;
  } else if (tab === SPENDING_PAGE_TAB.CHART_BY_MONTH) {
    return <RecordList />;
  } else if (tab === SPENDING_PAGE_TAB.ANNUAL_REVIEW) {
    return <YearlyRecordList />;
  }
  return <Dashboard />;
};
