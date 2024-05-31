"use client";
import { askNotificationPermission } from "@/utils/askNotificationPermission";
import { register } from "@/utils/registerSW";
import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    askNotificationPermission().then(() => {
      register();
    });
  }, []);

  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <div className="flex flex-col rounded-3xl border border-solid border-gray-d0-500 my-4 max-w-1/2"></div>
    </main>
  );
}
