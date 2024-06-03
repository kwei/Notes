"use client";
import { ChangeEvent, useCallback, useEffect, useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";

interface Props {
  onChange: (date: string) => void;
}

export const MonthSelector = (props: Props) => {
  const { onChange } = props;
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  const [currentDate, setCurrentDate] = useState<string>(
    `${currentYear}-${currentMonth.toString().padStart(2, "0")}`,
  );

  const handleOnChangeMonth = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setCurrentDate(value);
    },
    [],
  );

  const handleChangeMonthByStep = useCallback((step: number) => {
    setCurrentMonth((prevMonthState) => {
      if (step === 1) {
        if (prevMonthState === 12) {
          setCurrentYear((prevYearState) => prevYearState + 1);
          return 1;
        } else {
          return prevMonthState + 1;
        }
      } else if (step === -1) {
        if (prevMonthState === 1) {
          setCurrentYear((prevYearState) => prevYearState - 1);
          return 12;
        } else {
          return prevMonthState - 1;
        }
      }
      return prevMonthState;
    });
  }, []);

  useEffect(() => {
    setCurrentDate(
      `${currentYear}-${currentMonth.toString().padStart(2, "0")}`,
    );
  }, [currentYear, currentMonth]);

  useEffect(() => {
    onChange(currentDate);
  }, [onChange, currentDate]);

  return (
    <div className="w-full flex items-center justify-between">
      <button
        className="size-5 rounded-full hover:bg-stone-300/50 hover:text-gray-800 flex items-center justify-center transition-colors"
        onClick={() => handleChangeMonthByStep(-1)}
      >
        <IoCaretBack className="size-4" />
      </button>
      <input
        type="month"
        className="bg-transparent caret-gray-d0-500 focus:outline-none"
        value={currentDate}
        onChange={handleOnChangeMonth}
      />
      <button
        className="size-5 rounded-full hover:bg-stone-300/50 hover:text-gray-800 flex items-center justify-center transition-colors"
        onClick={() => handleChangeMonthByStep(1)}
      >
        <IoCaretForward className="size-4" />
      </button>
    </div>
  );
};
