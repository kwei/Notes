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
			className={`flex flex-col h-full scrollbar overflow-hidden overflow-y-scroll ${props.className}`}
		>
			{Object.entries(articles).map(([category, topics]) => (
				<div key={category} className='w-full flex flex-col border-b border-solid border-gray-500 p-4'>
					<label className='pb-2'>{category.toUpperCase()}</label>
					{Object.entries(topics).map(([topic, files]) => (
						<CollapseContainer key={topic} label={topic} className='pl-4'>
							{files.map(file => (
								<CollapseItem key={file.fileName}>
									<ArticleButton
										file={file}
										category={category}
										topic={topic}
										setArticleLink={props.setArticleName}
									/>
								</CollapseItem>
							))}
						</CollapseContainer>
					))}
				</div>
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
		<button className="rounded-lg hover:bg-gray-500/70 w-full py-2 text-left pl-4 transition-all" onClick={handleOnSelectArticle} title={file.fileName}>{file.fileName}</button>
	);
});
ArticleButton.displayName = "ArticleButton";