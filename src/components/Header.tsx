"use client";

import { Dropdown } from "@/components/Dropdown";
import { MyInfo } from "@/components/MyInfo";
import { NavMenu } from "@/components/NavMenu";
import { ROUTE_TABLE, ROUTES } from "@/utils/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdLaunch, MdMenu } from "react-icons/md";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);
  const [route, setRoute] = useState("NOTES");

  function handleOnChangeRoute(_route: string) {
    router.push(ROUTES[_route]);
  }

  function handleOpenNav() {
    setOpenNav(true);
  }

  function handleCloseNav() {
    setOpenNav(false);
  }

  useEffect(() => {
    setRoute(ROUTE_TABLE[pathname]);
  }, [pathname]);

  return (
    <>
      <header className="z-10 bg-gray-800 flex items-center justify-between px-4 py-4">
        <div className="flex items-center gap-4">
          <button className="lg:hidden size-6 group" onClick={handleOpenNav}>
            <MdMenu className="w-full h-full group-hover:text-blue-5F-500 transition-all" />
          </button>
          <MyInfo />
          <nav className="max-lg:hidden flex items-center ml-4 pl-8 gap-6 border-l-2 border-solid border-gray-500">
            {Object.entries(ROUTES).map(([label, path]) => (
              <Link
                key={label}
                href={path}
                className={`no-underline text-gray-d0-500 transition-colors ${route === label ? "text-green-50-500" : "hover:text-green-50-500"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="lg:hidden flex-1 flex items-center justify-center">
          <Dropdown
            onChange={handleOnChangeRoute}
            value={route}
            className="rounded-lg border border-solid border-gray-d0-500 text-center w-fit p-2 hover:border-green-50-500 hover:text-green-50-500"
          >
            {Object.entries(ROUTES).map(([label]) => (
              <Dropdown.Option key={label} value={label} />
            ))}
          </Dropdown>
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
      </header>
      {pathname === "/" && <NavMenu open={openNav} onClose={handleCloseNav} />}
    </>
  );
};
