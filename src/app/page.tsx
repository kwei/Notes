"use client";

import { CheckArticle } from "@/components/CheckArticle";
import { ArticleContainer } from "@/components/ArticleContainer";
import { Comment } from "@/components/Comment";
import { TopicList } from "@/components/TopicList";

export default function Home() {
  return (
    <CheckArticle>
      <main className="grid w-full flex-1 grid-cols-5">
        <TopicList className="max-lg:hidden col-span-1" />
        <div className="flex h-full flex-col col-span-4 max-lg:col-span-5 max-lg:w-full items-center">
          <ArticleContainer />
          <Comment />
        </div>
      </main>
    </CheckArticle>
  );
}
