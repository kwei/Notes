"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  className?: string;
}

export const SectionList = (props: Props) => {
  return (
    <aside
      className={`flex flex-col flex-1 w-1/5 gap-4 p-4 ${props.className}`}
    >
      <label>SECTIONS</label>
      <Section label="Title 1" />
      <Section label="Title 2" />
      <Section label="Title 3" />
      <SubSection label="SubTitle 1" />
      <SubSection label="SubTitle 2" />
      <Section label="Title 4" />
      <SubSection label="SubTitle 1" />
      <SubSection label="SubTitle 2" />
      <SubSection label="SubTitle 3" />
    </aside>
  );
};

const Section = ({ label }: { label: string }) => {
  return (
    <a href="#" title={label} className="text-sm hover:text-green-50-500">
      {label}
    </a>
  );
};

const SubSection = ({ label }: { label: string }) => {
  return (
    <a href="#" title={label} className="text-sm ml-4 hover:text-green-50-500">
      {label}
    </a>
  );
};
