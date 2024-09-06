import { Tag } from "@/app/task/v2/Tag";
import { useTaskModalContext } from "@/app/task/v2/TaskModalContext";
import { ITodo } from "@/type";
import { formatPeriod } from "@/utils/formatPeriod";

export const TaskCard = ({ task }: { task: ITodo }) => {
  const { setTask } = useTaskModalContext();
  return (
    <button
      type="button"
      title={task.title}
      onClick={() => setTask(task)}
      className="bg-gray-40-500 hover:bg-gray-40-500/50 flex flex-col rounded border border-solid border-gray-500 px-2 py-3 transition-colors hover:cursor-pointer"
    >
      <span className="text-start text-sm">{task.title}</span>
      <span className="text-xs text-gray-500">
        {formatPeriod(task.iat, task.expiry)}
      </span>
      <div className="flex flex-wrap items-center gap-1 pt-3 text-xs">
        {task.tags.map((tag, i) => (
          <Tag key={`${tag.name}-${i.toString()}`} tag={tag} />
        ))}
      </div>
    </button>
  );
};
