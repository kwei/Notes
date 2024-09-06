"use client";

import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  label: ReactNode | string | number | string[] | number[];
  open?: boolean;
}

export const Accordion = (props: Props) => {
  const { label, open = false, children, ...legacy } = props;
  return (
    <div className="block w-full">
      <details className="group/accordion peer/accordion w-full" open={open}>
        <summary {...legacy}>{label}</summary>
      </details>
      <div className="grid w-full grid-rows-[0fr] transition-[grid-template-rows] duration-300 peer-open/accordion:grid-rows-[1fr]">
        <div className="w-full overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
