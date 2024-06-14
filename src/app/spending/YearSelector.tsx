"use client";
import { useCallback, useEffect, useState } from "react";
import { IoCaretBack, IoCaretForward } from "react-icons/io5";

interface Props {
  onChange: (date: string) => void;
}

export const YearSelector = (props: Props) => {
  const { onChange } = props;
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const handleChangeYearByStep = useCallback((step: 1 | -1) => {
    setCurrentYear((prev) => prev + step);
  }, []);

  useEffect(() => {
    onChange(currentYear.toString());
  }, [onChange, currentYear]);

  return (
    <div className="flex w-full items-center justify-between">
      <button
        className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-stone-300/50 hover:text-gray-800"
        onClick={() => handleChangeYearByStep(-1)}
      >
        <IoCaretBack className="size-4" />
      </button>
      <span>{currentYear}</span>
      <button
        className="flex size-5 items-center justify-center rounded-full transition-colors hover:bg-stone-300/50 hover:text-gray-800"
        onClick={() => handleChangeYearByStep(1)}
      >
        <IoCaretForward className="size-4" />
      </button>
    </div>
  );
};
