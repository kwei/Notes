import { memo } from "react";

export const ArticleButton = memo(
  ({
    file,
    onClick,
    category,
    topic,
    selected,
  }: {
    file: { fileName: string; fileUrl: string };
    onClick: (category: string, topic: string, article: string) => void;
    category: string;
    topic: string;
    selected: boolean;
  }) => {
    function handleOnSelectArticle() {
      onClick(category, topic, file.fileName);
    }

    return (
      <button
        className={`rounded-lg w-full py-2 text-left pl-4 transition-all ${selected ? "bg-gray-500/70" : "hover:bg-gray-500/70"}`}
        onClick={handleOnSelectArticle}
        title={file.fileName}
      >
        {file.fileName}
      </button>
    );
  },
);
ArticleButton.displayName = "ArticleButton";
