"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import Link from "next/link";
import { ReactNode } from "react";

interface Props {
  className?: string;
}

export const TopicList = (props: Props) => {
  return (
    <aside
      className={`flex flex-col flex-1 w-1/5 scrollbar gap-4 overflow-y-scroll p-4 ${props.className}`}
    >
      <label>TOPICS</label>
      <CollapseContainer label="Testing">
        <ul className="w-full flex flex-col gap-4 px-4 pt-2">
          <CollapseItem>
            <Link href="/">Some Article</Link>
          </CollapseItem>
          <CollapseItem>
            <Link href="/">Some Article</Link>
          </CollapseItem>
        </ul>
      </CollapseContainer>

      <CollapseContainer label="React Pattenrs">
        <ul className="w-full flex flex-col gap-4 px-4 pt-2">
          <CollapseItem>
            <Link href="/">Some Article</Link>
          </CollapseItem>
          <CollapseItem>
            <Link href="/">Some Article</Link>
          </CollapseItem>
        </ul>
      </CollapseContainer>
    </aside>
  );
};

const CollapseItem = ({ children }: { children: ReactNode }) => {
  return <div className="">{children}</div>;
};
