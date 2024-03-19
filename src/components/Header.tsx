"use client";

import { MyInfo } from "@/components/MyInfo";
import { NavMenu } from "@/components/NavMenu";
import Link from "next/link";
import { useState } from "react";
import { MdLaunch, MdMenu } from "react-icons/md";

export const Header = () => {
  const [openNav, setOpenNav] = useState(false);

  function handleOpenNav() {
    setOpenNav(true);
  }

  function handleCloseNav() {
    setOpenNav(false);
  }

  return (
    <header className="w-full bg-gray-800/50 flex items-center justify-between px-4 py-4">
      <div className="flex items-center gap-4">
        <button className="lg:hidden size-6 group" onClick={handleOpenNav}>
          <MdMenu className="w-full h-full group-hover:text-blue-5F-500 transition-all" />
        </button>
        <MyInfo />
        <nav className="max-lg:hidden flex items-center ml-4 pl-8 gap-4 border-l-2 border-solid border-gray-500">
          <Link href="/" className="hover:text-green-50-500 no-underline text-gray-d0-500 transition-colors">
            NOTES
          </Link>
          <Link href="/" className="hover:text-green-50-500 no-underline text-gray-d0-500 transition-colors">
            PROFILE
          </Link>
        </nav>
      </div>
      <div className="max-lg:hidden flex items-center gap-4">
        <a
          href="https://github.com/kwei"
          className="flex items-center hover:underline hover:text-blue-5F-500 transition-all"
          target="_blank"
          rel="noreferrer noopener"
        >
          Github
          <MdLaunch className="size-4 mx-1" />
        </a>
        <a
          href="https://www.linkedin.com/in/kaiwei-yeh-bios/"
          className="flex items-center hover:underline hover:text-blue-5F-500 transition-all"
          target="_blank"
          rel="noreferrer noopener"
        >
          LinkedIn
          <MdLaunch className="size-4 mx-1" />
        </a>
      </div>

      {openNav && <NavMenu onClose={handleCloseNav} />}
    </header>
  );
};
