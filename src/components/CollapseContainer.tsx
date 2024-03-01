"use client";

import { ReactNode, useState } from "react";
import { MdNavigateNext } from "react-icons/md";

interface Props {
  label: string;
  children: ReactNode;
  className?: string;
}

export const CollapseContainer = (props: Props) => {
  const [open, setOpen] = useState(false);

  function handleTriggerDetail() {
    setOpen((prevState) => !prevState);
  }

  return (
    <details className={`${props.className} hover:cursor-pointer`} title={props.label} onClick={handleTriggerDetail}>
      <summary className='flex items-center justify-between select-none hover:text-blue-5F-500 transition-all break-words'>
        {props.label}
        <MdNavigateNext className={`size-4 transition-all ${open ? 'rotate-90' : 'rotate-0'}`} />
      </summary>
      {props.children}
    </details>
  );
};
