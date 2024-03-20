"use client";

import { useFocusRef } from "@/hooks/useFocusRef";
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { IoTriangle } from "react-icons/io5";

interface Props {
  value?: string;
  onChange: (option: string) => void;
  placeHolder?: string;
  className?: string;
  children: ReactNode;
}

export const Dropdown = (props: Props) => {
  const { value, onChange, placeHolder, className = "", children } = props;
  const [open, setOpen] = useState(false);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  const handleTriggerMenu = useCallback(() => {
    setOpen((prevState) => !prevState);
  }, []);

  const handleOnChange = useCallback(
    (value: string) => {
      onChange(value);
      setOpen(false);
    },
    [onChange],
  );

  const contextValue = useMemo(
    () => ({
      value,
      onChange: handleOnChange,
    }),
    [handleOnChange, value],
  );

  return (
    <div ref={ref} className="relative">
      <button
        onClick={handleTriggerMenu}
        className={`flex items-center gap-3 transition-all ${className}`}
      >
        <span className="flex-1">{value ?? placeHolder ?? "Select One"}</span>
        <IoTriangle className="size-3 rotate-180 mx-2.5" />
      </button>
      <DropdownContext.Provider value={contextValue}>
        <div
          className={`rounded-lg z-50 absolute top-full origin-top left-0 right-0 flex flex-col gap-2.5 mt-2 bg-gray-800 overflow-x-hidden overflow-y-auto p-2.5 transition-all ${open ? "scale-y-100" : "scale-y-0"}`}
          style={{
            maxHeight: calculateDropdownHeight(ref.current) + "px",
          }}
        >
          {children}
        </div>
      </DropdownContext.Provider>
    </div>
  );
};

interface OptionProps {
  value: string;
}

const Option = (props: OptionProps) => {
  const { value, onChange } = useContext(DropdownContext);

  const handleOnClick = useCallback(() => {
    onChange(props.value);
  }, [onChange, props.value]);

  return (
    <button
      onClick={handleOnClick}
      className={`py-2 rounded-md transition-all ${props.value === value ? "text-green-50-500 bg-gray-600" : "hover:bg-gray-600 hover:text-green-50-500"}`}
    >
      {props.value}
    </button>
  );
};

Dropdown.Option = Option;

function calculateDropdownHeight(element: HTMLElement | null) {
  const marginValue = 8;
  const paddingValue = 20;
  if (typeof window === "undefined") return 500;
  if (!element) return window.innerHeight * (2 / 5);
  return (
    window.innerHeight -
    element.getBoundingClientRect().bottom -
    marginValue -
    paddingValue
  );
}

const DropdownContext = createContext<{
  value?: string;
  onChange: (option: string) => void;
}>({
  value: undefined,
  onChange: () => {},
});
