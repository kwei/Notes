import { memo } from "react";

export const ArticleButton = memo(
  ({
    file,
    onClick,
    category,
    topic,
    selected,
  }: {
    file: { name: string; id: string };
    onClick: (
      category: string,
      topic: string,
      article: string,
      id: string,
    ) => void;
    category: string;
    topic: string;
    selected: boolean;
  }) => {
    function handleOnSelectArticle() {
      onClick(category, topic, file.name, file.id);
    }

    return (
      <button
        className={`rounded-lg w-full py-2 text-left px-4 transition-all ${selected ? "bg-gray-500/70" : "hover:bg-gray-500/70"}`}
        onClick={handleOnSelectArticle}
        title={file.name}
      >
        {file.name}
      </button>
    );
  },
);
ArticleButton.displayName = "ArticleButton";
