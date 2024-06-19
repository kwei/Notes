"use client";

import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLElement> {
  label: ReactNode | string | number | string[] | number[];
}

export const Accordion = (props: Props) => {
  const { label, children, ...legacy } = props;
  return (
    <div className="block w-full">
      <details className="group/accordion peer/accordion">
        <summary {...legacy}>{label}</summary>
      </details>
      <div className="grid grid-rows-[0fr] transition-[grid-template-rows] duration-300 peer-open/accordion:grid-rows-[1fr]">
        <div className="overflow-hidden">{children}</div>
      </div>
    </div>
  );
};
