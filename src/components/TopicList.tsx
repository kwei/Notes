"use client";

import { CollapseContainer } from "@/components/CollapseContainer";
import { memo, ReactNode, useEffect, useState } from "react";

interface Props {
	className?: string;
	setArticleName: (article: string) => void;
}

export const TopicList = (props: Props) => {
	const [articles, setArticles] = useState<GitTree>({});

	useEffect(() => {
		fetch(`/api/article?getList=true`)
			.then((res) => res.json())
			.then((data: GitTree) => {
				setArticles(data);
			});
	}, []);

	return (
		<aside
			className={`flex flex-col h-full scrollbar gap-4 overflow-hidden overflow-y-scroll p-4 ${props.className}`}
		>
			<label>TOPICS</label>
			{Object.entries(articles).map(([category, topics]) => (
				<>
					<label key={category}>{category}</label>
					{Object.entries(topics).map(([topic, files]) => (
						<CollapseContainer key={topic} label={topic}>
							{files.map(file => (
								<CollapseItem key={file.fileName}>
									<ArticleButton file={file} category={category} topic={topic} setArticleLink={props.setArticleName}/>
								</CollapseItem>
							))}
						</CollapseContainer>
					))}
				</>
			))}
		</aside>
	);
};

const CollapseItem = ({children}: { children: ReactNode }) => {
	return <div className="">{children}</div>;
};

const ArticleButton = memo(({file, setArticleLink, category, topic}: {
	file: { fileName: string; fileUrl: string },
	setArticleLink: (articleLink: string) => void,
	category: string,
	topic: string
}) => {
	function handleOnSelectArticle() {
		setArticleLink(`${category}/${topic}/${file.fileName}`);
	}

	return (
		<button className="" onClick={handleOnSelectArticle}>{file.fileName}</button>
	);
});
ArticleButton.displayName = "ArticleButton";