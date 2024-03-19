"use client";

import { Comment } from "@/components/Comment";
import { ArticleContainer } from "@/components/ArticleContainer";
import { TopicList } from "@/components/TopicList";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!searchParams.has("article")) {
      router.push("?category=Static&topic=About&article=Home.md");
    }
  }, [router, searchParams]);

  return (
    <main className="grid w-full flex-1 grid-cols-5">
      <TopicList className="max-lg:hidden col-span-1" />
      <div className="flex h-full flex-col col-span-4 max-lg:col-span-5 max-lg:w-full items-center">
        <ArticleContainer />
        <Comment />
      </div>
    </main>
  );
}
