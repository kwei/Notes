import { ITag } from "@/type";
import { IoClose } from "react-icons/io5";

interface Props {
  tag: ITag;
  onClose?: () => void;
}

export const Tag = ({ tag, onClose }: Props) => {
  return (
    <span
      className="group/tag relative rounded-sm px-1 py-px text-black brightness-100 transition-all hover:brightness-110"
      title={tag.name}
      style={{
        backgroundColor: tag.color,
      }}
    >
      {tag.name}
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="absolute -right-2 -top-2 size-4 rounded-full bg-red-500/30 text-black/30 opacity-0 transition-all hover:bg-red-500/50 hover:text-black/50 group-hover/tag:opacity-100"
        >
          <IoClose className="size-4" />
        </button>
      )}
    </span>
  );
};
