"use client";
import { askNotificationPermission } from "@/utils/askNotificationPermission";
import { register } from "@/utils/registerSW";
import { useEffect } from "react";

export const NotificationRegister = () => {
  useEffect(() => {
    askNotificationPermission().then(() => {
      register();
    });
  }, []);

  return <></>;
};
