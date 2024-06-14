"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export const useGetHash = () => {
  const [tab, setTab] = useState("");
  const params = useParams();

  useEffect(() => {
    setTab(window.location.hash.replace("#", ""));
  }, [params]);

  return tab;
};
