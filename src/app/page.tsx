"use client";

import { Comment } from "@/components/Comment";
import { ArticleContainer } from "@/components/ArticleContainer";
import { TopicList } from "@/components/TopicList";
import { useState } from "react";

export default function Home() {
	const [articleName, setArticleName] = useState<string>("static/about/home.md");
	return (
		<main className="grid w-full flex-1 grid-cols-5">
			<TopicList className="max-lg:hidden col-span-1" setArticleName={setArticleName}/>
			<div className="flex h-full flex-col col-span-4 max-lg:w-full items-center">
				<ArticleContainer articleName={articleName}/>
				<Comment/>
			</div>
		</main>
	);
}
