"use client";

import { ReactNode, useState } from "react";
import { MdNavigateNext } from "react-icons/md";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
  open: boolean;
}

export const CollapseContainer = (props: Props) => {
  const [open, setOpen] = useState(props.open);

  function handleOnToggle() {
    setOpen((prevState) => !prevState);
  }

  return (
    <details
      className={`${props.className} pl-2 border-l-2 border-solid transition-all ${open ? "border-blue-5F-500" : "border-blue-5F-500/50 hover:border-blue-5F-500"} group hover:cursor-pointer`}
      title={props.label}
      open={props.open}
      onToggle={handleOnToggle}
    >
      <summary
        className={`flex items-center justify-between select-none transition-all break-words ${open ? "text-blue-5F-500" : "group-hover:text-blue-5F-500"}`}
      >
        {props.label}
        <MdNavigateNext
          className={`size-4 transition-all ${props.open ? "rotate-90" : "rotate-0"}`}
        />
      </summary>
      <ul className="w-full flex flex-col pl-2 mt-2 gap-2 m-0">
        {props.children}
      </ul>
    </details>
  );
};
