"use client";

import { Dropdown } from "@/components/Dropdown";
import { MyInfo } from "@/components/MyInfo";
import { ROUTE_TABLE, ROUTES } from "@/utils/constants";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { MdLaunch } from "react-icons/md";

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const [route, setRoute] = useState("NOTES");

  function handleOnChangeRoute(_route: string) {
    router.push(ROUTES[_route]);
  }

  useEffect(() => {
    setRoute(ROUTE_TABLE[pathname]);
  }, [pathname]);

  return (
    <>
      <header className="sticky left-0 right-0 top-0 z-50 flex items-center justify-between px-4 py-4 shadow-md backdrop-blur-sm">
        <div className="flex items-center gap-4">
          <MyInfo />
          <nav className="ml-4 flex items-center gap-6 border-l-2 border-solid border-gray-500 pl-8 max-lg:hidden">
            {Object.entries(ROUTES).map(([label, path]) => (
              <Link
                key={label}
                href={path}
                className={`text-gray-d0-500 no-underline transition-colors ${route === label ? "text-green-50-500" : "hover:text-green-50-500"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-center lg:hidden">
          <Dropdown
            onChange={handleOnChangeRoute}
            value={route}
            className="w-fit rounded-lg border border-solid border-gray-d0-500 p-2 text-center hover:border-green-50-500 hover:text-green-50-500"
          >
            {Object.entries(ROUTES).map(([label]) => (
              <Dropdown.Option key={label} value={label} />
            ))}
          </Dropdown>
        </div>
        <div className="flex items-center gap-4 max-lg:hidden">
          <a
            href="https://github.com/kwei"
            className="flex items-center transition-all hover:text-blue-5F-500 hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            Github
            <MdLaunch className="mx-1 size-4" />
          </a>
          <a
            href="https://www.linkedin.com/in/kaiwei-yeh-bios/"
            className="flex items-center transition-all hover:text-blue-5F-500 hover:underline"
            target="_blank"
            rel="noreferrer noopener"
          >
            LinkedIn
            <MdLaunch className="mx-1 size-4" />
          </a>
        </div>
      </header>
    </>
  );
};
