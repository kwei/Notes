"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ReactNode, useEffect } from "react";

export const CheckArticle = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("article")) {
      router.push(
        "?category=Static&topic=About&article=Home&id=0d4ffab5f6ef47679da1acfb75dd042a",
      );
    }
  }, [router, searchParams]);

  return children;
};
