"use client";

import { Comment } from "@/components/Comment";
import { ArticleContainer } from "@/components/ArticleContainer";
import { SectionList } from "@/components/SectionList";
import { TopicList } from "@/components/TopicList";
import { useState } from "react";

export default function Home() {
	const [articleName, setArticleName] = useState<string>("static/about/home");
	return (
		<main className="grid w-full flex-1 grid-cols-5">
			<TopicList className="max-lg:hidden col-span-1" setArticleName={setArticleName}/>
			<div className="flex h-full flex-col col-span-3 max-lg:w-full items-center">
				<SectionList className="lg:hidden w-full h-auto"/>
				<ArticleContainer articleName={articleName}/>
				<Comment/>
			</div>
			<SectionList className="max-lg:hidden col-span-1 h-full"/>
		</main>
	);
}
