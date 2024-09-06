import { TaskListContainer } from "@/app/task/v2/TaskListContainer";
import { TASK_STATUS } from "@/utils/constants";

export const Dashboard = () => {
  return (
    <div className="flex h-full w-fit overflow-x-auto p-3">
      <TaskListContainer type={TASK_STATUS.BACKLOG} />
      <TaskListContainer type={TASK_STATUS.NEW_REQUEST} />
      <TaskListContainer type={TASK_STATUS.IN_PROGRESS} />
      <TaskListContainer type={TASK_STATUS.COMPLETE} />
    </div>
  );
};
