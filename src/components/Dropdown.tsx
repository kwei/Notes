"use client";

import { useFocusRef } from "@/hooks/useFocusRef";
import {
  createContext,
  HTMLAttributes,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoTriangle } from "react-icons/io5";

interface Props extends Omit<HTMLAttributes<HTMLButtonElement>, "onChange"> {
  value?: string;
  onChange: (option: string) => void;
  placeHolder?: string;
  option?: {
    showTriangle?: boolean;
    showValue?: boolean;
  };
  className?: string;
  children: ReactNode;
}

export const Dropdown = (props: Props) => {
  const {
    value,
    onChange,
    placeHolder,
    option = {
      showTriangle: true,
      showValue: true,
    },
    className = "",
    children,
    ...legacy
  } = props;
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const ref = useFocusRef<HTMLDivElement>(() => {
    setOpen(false);
  });

  const handleTriggerMenu = useCallback(() => {
    if (ref.current && menuRef.current) {
      menuRef.current.style.maxHeight =
        calculateDropdownHeight(ref.current) + "px";
    }
    setOpen((prevState) => !prevState);
  }, [ref]);

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

  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (timer) clearTimeout(timer);
    if (open) {
      timer = setTimeout(() => {
        menuRef.current?.classList.remove("overflow-y-hidden");
        menuRef.current?.classList.add("overflow-y-auto");
      }, 200);
    } else {
      menuRef.current?.classList.remove("overflow-y-auto");
      menuRef.current?.classList.add("overflow-y-hidden");
    }
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [open]);

  return (
    <div ref={ref} className={`relative ${className}`}>
      <button
        {...legacy}
        ref={btnRef}
        onClick={handleTriggerMenu}
        type="button"
        className="relative flex h-full w-full items-center gap-3 transition-all"
      >
        {option?.showValue && (
          <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap pl-2 pr-5 text-left">
            {value ?? placeHolder ?? "Select One"}
          </span>
        )}
        {option?.showTriangle && (
          <div className="absolute bottom-0 right-0 top-0 flex items-center justify-center">
            <IoTriangle className="mx-2.5 size-3 rotate-180" />
          </div>
        )}
      </button>
      <DropdownContext.Provider value={contextValue}>
        <div
          className={`absolute left-0 top-full z-40 mt-2 grid w-fit overflow-hidden transition-all ${open ? "grid-rows-1" : "grid-rows-0"}`}
        >
          <div
            ref={menuRef}
            className="bg-gray-40-500 row-span-1 flex w-fit flex-col gap-2.5 overflow-x-hidden overflow-y-hidden whitespace-nowrap rounded-lg border border-solid border-gray-500 p-2.5"
            style={{
              minWidth: btnRef?.current?.getBoundingClientRect().width + "px",
            }}
          >
            {children}
          </div>
        </div>
      </DropdownContext.Provider>
    </div>
  );
};

interface OptionProps
  extends Omit<HTMLAttributes<HTMLButtonElement>, "prefix"> {
  value: string;
  label?: string;
  prefix?: ReactNode;
  postfix?: ReactNode;
}

const Option = (props: OptionProps) => {
  const { label, value, prefix, postfix, className, ...legacy } = props;
  const { value: selected, onChange } = useContext(DropdownContext);

  const isSelected = useMemo(() => {
    const selectedList = (selected ?? "").split("; ");
    return selectedList.includes(value);
  }, [selected, value]);

  const handleOnClick = useCallback(() => {
    onChange(value);
  }, [onChange, value]);

  return (
    <button
      {...legacy}
      onClick={handleOnClick}
      type="button"
      className={`${className} flex items-center gap-3 rounded-md px-2 py-2 transition-all ${isSelected ? "bg-gray-40-300 text-green-50-500" : "hover:bg-gray-40-300 hover:text-green-50-500"}`}
    >
      {prefix}
      {label ?? value}
      {postfix}
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
