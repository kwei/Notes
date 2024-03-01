"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import { MyInfo } from "@/components/MyInfo";
import { useFocusRef } from "@/hooks/useFocusRef";
import Link from "next/link";
import { ReactNode } from "react";
import { MdOutlineArrowBack } from "react-icons/md";

interface Props {
  onClose: () => void;
}

export const NavMenu = (props: Props) => {
  const ref = useFocusRef(props.onClose);
  return (
    <div
      ref={ref}
      className="fixed flex flex-col left-0 top-0 bottom-0 w-[350px] bg-gray-900 animate-slideIn"
    >
      <div className="relative w-full flex items-center gap-4 px-4 py-4">
        <MyInfo />
        <button
          className="size-6 absolute top-4 right-4"
          onClick={props.onClose}
        >
          <MdOutlineArrowBack className="w-full h-full hover:text-blue-5F-500 transition-all" />
        </button>
      </div>

      <div className="w-full border-t border-solid border-gray-2c-500 p-4">
        <CollapseContainer label="Pages">
          <ul className="w-full flex flex-col gap-4 px-4 pt-2">
            <CollapseItem>
              <Link href="/">Notes</Link>
            </CollapseItem>
          </ul>
        </CollapseContainer>
      </div>

      <div className="w-full border-t border-solid border-gray-2c-500 p-4">
        <CollapseContainer label="Topics">
          <ul className="w-full flex flex-col gap-1 px-4 pt-2">
            <CollapseItem>
              <a href="#">Article 1</a>
            </CollapseItem>
            <CollapseItem>
              <a href="#">Article 2</a>
            </CollapseItem>
          </ul>
        </CollapseContainer>
      </div>
    </div>
  );
};

const CollapseItem = ({ children }: { children: ReactNode }) => {
  return (
    <li className="w-full px-4 py-2 rounded-lg hover:bg-gray-2c-500 transition-all">
      {children}
    </li>
  );
};
