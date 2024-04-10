import { TASK_COLOR } from "@/utils/constants";

export const TagBlock = ({
  tag,
}: {
  tag: { name: string; color: TASK_COLOR };
}) => {
  return (
    <span
      className="text-sm rounded-md text-black px-2 py-px select-none"
      style={{
        backgroundColor: tag.color,
      }}
      key={tag.name}
    >
      {tag.name}
    </span>
  );
};
