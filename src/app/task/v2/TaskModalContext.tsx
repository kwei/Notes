"use client";

import { Tag } from "@/app/task/v2/Tag";
import { useTaskContext } from "@/app/task/v2/TasksContext";
import { Dropdown } from "@/components/Dropdown";
import { useAllTags } from "@/hooks/useAllTags";
import { useFocusRef } from "@/hooks/useFocusRef";
import { IMongoQueryRes, IMsgLog, ITag, ITodo } from "@/type";
import { COLOR_TABLE, TASK_STATUS } from "@/utils/constants";
import { deleteTodo } from "@/utils/deleteTodo";
import { formatDateString } from "@/utils/formatDateString";
import { setTodo } from "@/utils/setTodo";
import { updateTodo } from "@/utils/updateTodo";
import {
  createContext,
  FormEvent,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";

interface ICtx {
  setTask: (task?: ITodo) => void;
}

const initCtx: ICtx = {
  setTask: (_task?: ITodo) => {},
};

export const TaskModalContext = ({ children }: { children: ReactNode }) => {
  const [task, setTask] = useState<ITodo>();
  return (
    <Ctx.Provider value={useMemo(() => ({ setTask }), [])}>
      {children}
      <TaskModel task={task} />
    </Ctx.Provider>
  );
};

const Ctx = createContext<ICtx>(initCtx);
export const useTaskModalContext = () => useContext(Ctx);

const TaskModel = ({ task }: { task?: ITodo }) => {
  const { setTask } = useContext(Ctx);
  const { reFetch } = useTaskContext();
  const isOpen = useMemo(() => !!task, [task]);
  const close = useCallback(() => setTask(undefined), [setTask]);
  const ref = useFocusRef<HTMLDivElement>(() => close());
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const deleteTask = useCallback(() => {
    if (!task || task.title.trim() === "") return;
    setDeleting(true);
    deleteTodo(task).then((res: IMongoQueryRes) => {
      console.log("Delete Task: ", res.status, JSON.parse(res.message));
      reFetch().finally(() => {
        setDeleting(false);
        close();
      });
    });
  }, [close, reFetch, task]);

  const saveTask = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      if (!task) return;
      setSaving(true);
      const formData = new FormData(event.target as HTMLFormElement);
      const newTaskTitle = formData.get("task-title") as string;
      if (newTaskTitle.trim() === "") return;
      const newTaskStatus = formData.get(
        "task-status",
      ) as string as TASK_STATUS;
      const newTaskTags = JSON.parse(
        formData.get("task-tags") as string,
      ) as ITag[];
      const newTaskComments = JSON.parse(
        formData.get("task-comments") as string,
      ) as IMsgLog[];
      const newTaskIat = formData.get("task-iat")
        ? new Date(formData.get("task-iat") as string)
        : undefined;
      const newTaskExpiry = formData.get("task-expiry")
        ? new Date(formData.get("task-expiry") as string)
        : undefined;
      const newTaskDetail = formData.get("task-detail") as string;
      const payload: ITodo = {
        ...task,
        title: newTaskTitle,
        status: { name: newTaskStatus },
        tags: newTaskTags,
        msgLog: newTaskComments,
        iat: newTaskIat,
        expiry: newTaskExpiry,
        detail: newTaskDetail,
      };
      if (task.title !== "") {
        updateTodo(task, payload).then((res: IMongoQueryRes) => {
          console.log("Update Task: ", res.status, JSON.parse(res.message));
          reFetch().finally(() => {
            setSaving(false);
            (event.target as HTMLFormElement).reset();
            close();
          });
        });
      } else {
        setTodo(payload).then((res: IMongoQueryRes) => {
          console.log("Save Task: ", res.status, JSON.parse(res.message));
          reFetch().finally(() => {
            setSaving(false);
            (event.target as HTMLFormElement).reset();
            close();
          });
        });
      }
    },
    [close, reFetch, task],
  );

  return (
    <div
      className={`${isOpen ? "visible" : "invisible"} fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50`}
    >
      <div
        ref={ref}
        className={`${isOpen ? "scale-100" : "scale-0"} relative flex h-full w-full flex-col overflow-y-auto bg-gray-40-300 p-4 transition-transform md:h-auto md:w-[800px] md:rounded-xl md:p-6`}
      >
        {task && (
          <form className="flex h-full flex-col md:h-auto" onSubmit={saveTask}>
            <TitleEditor text={task.title} />
            <div className="flex w-full flex-col divide-y divide-gray-500 rounded-sm border border-solid border-gray-500">
              <StatusSelector status={task.status.name} />
              <TagSelector tags={task.tags} />
              <TimeSelector iat={task.iat} expiry={task.expiry} />
              <DetailEditor text={task.detail} />
            </div>
            <Comments comments={task.msgLog} />
            <div className="flex w-full flex-1 items-end justify-between pt-6">
              <button
                type="button"
                onClick={deleteTask}
                disabled={deleting}
                className="relative flex items-center justify-center rounded border border-solid border-red-ff-500 bg-red-ff-500 px-2 py-1 text-red-100 transition-colors hover:border-red-ff-300 hover:bg-red-ff-300 hover:text-red-900"
              >
                <span
                  className={`transition-opacity ${deleting ? "opacity-0" : "opacity-100"}`}
                >
                  Delete
                </span>
                {deleting && (
                  <span className="absolute size-3 animate-spin rounded-full border-2 border-solid border-gray-d0-500 border-l-transparent"></span>
                )}
              </button>
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  onClick={close}
                  disabled={deleting}
                  className="flex items-center justify-center rounded border border-solid border-red-ff-500 px-2 py-1 text-red-ff-500 transition-colors hover:border-red-ff-300 hover:bg-red-ff-300 hover:text-red-900"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center justify-center rounded border border-solid border-green-50-500 bg-green-50-500 px-2 py-1 text-green-900 transition-colors hover:border-green-50-300 hover:bg-green-50-300"
                >
                  <span
                    className={`transition-opacity ${saving ? "opacity-0" : "opacity-100"}`}
                  >
                    Save Task
                  </span>
                  {saving && (
                    <span className="absolute size-3 animate-spin rounded-full border-2 border-solid border-gray-700 border-l-transparent"></span>
                  )}
                </button>
              </div>
            </div>
          </form>
        )}
        <button
          type="button"
          onClick={close}
          className="absolute right-2 top-2 size-6 text-gray-500 transition-colors hover:text-black/70"
        >
          <IoClose className="size-6" />
        </button>
      </div>
    </div>
  );
};

const TitleEditor = ({ text }: { text: string }) => {
  return (
    <div className="w-full pb-4 pr-4 md:pr-6">
      <input
        type="text"
        id="task-title"
        name="task-title"
        className="w-full bg-transparent pl-4 text-xl focus:outline-0"
        defaultValue={text}
        placeholder="New Task - Title"
      />
    </div>
  );
};

const Comments = ({ comments = [] }: { comments?: IMsgLog[] }) => {
  const ref = useRef<HTMLInputElement>(null);
  const [newComments, setNewComments] = useState<IMsgLog[]>([]);

  const addNewComment = () => {
    if (ref.current && ref.current.value.trim() !== "") {
      const text = ref.current.value.trim();
      setNewComments((prevState) => {
        const newState = [...prevState];
        newState.push({
          text,
          datetime: new Date().toISOString(),
        });
        return newState;
      });
      ref.current.value = "";
    }
  };

  return (
    <div className="flex w-full flex-col gap-2 pt-4">
      <div className="flex w-full items-center gap-1 divide-x divide-gray-500 rounded-sm border border-solid border-gray-500">
        <input
          ref={ref}
          type="text"
          className="h-full w-full bg-transparent p-1 focus:outline-0"
          placeholder="Write comments..."
        />
        <button
          type="button"
          onClick={addNewComment}
          className="w-fit bg-gray-600 px-2 py-1 hover:bg-gray-500"
        >
          Save
        </button>
      </div>
      {comments.concat(newComments).map((comment, i) => (
        <fieldset key={`comment-${i.toString()}`}>
          <legend className="text-xs text-gray-500">{comment.datetime}</legend>
          <span className="text-sm">{comment.text}</span>
        </fieldset>
      ))}
      <input
        type="text"
        id="task-comments"
        name="task-comments"
        value={JSON.stringify(comments.concat(newComments))}
        readOnly
        hidden
      />
    </div>
  );
};

const DetailEditor = ({ text }: { text: string }) => {
  return (
    <div className="grid w-full grid-cols-12 divide-x divide-gray-500 text-base">
      <div className="col-span-3 flex items-center">
        <span className="p-2 pl-4">Detail</span>
      </div>
      <div className="col-span-9 flex items-center gap-2 p-2">
        <textarea
          id="task-detail"
          name="task-detail"
          rows={8}
          className="w-full resize-none bg-transparent focus:outline-0"
          defaultValue={text}
        />
      </div>
    </div>
  );
};

const TimeSelector = ({ iat, expiry }: { iat?: Date; expiry?: Date }) => {
  return (
    <div className="grid w-full grid-cols-12 divide-x divide-gray-500 text-base">
      <div className="col-span-3 flex items-center">
        <span className="p-2 pl-4">Time</span>
      </div>
      <div className="col-span-9 flex flex-col gap-2 p-2">
        <div className="flex items-center gap-2">
          <span className="w-14">Start: </span>
          <input
            type="date"
            id="task-iat"
            name="task-iat"
            className="flex-1 bg-transparent focus:outline-0"
            defaultValue={iat && formatDateString(iat)}
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="w-14">End: </span>
          <input
            type="date"
            id="task-expiry"
            name="task-expiry"
            className="flex-1 bg-transparent focus:outline-0"
            defaultValue={expiry && formatDateString(expiry)}
          />
        </div>
      </div>
    </div>
  );
};

const StatusSelector = ({ status }: { status: string }) => {
  const [updatedStatus, setUpdatedStatus] = useState(status);

  const onChange = (_status: string) => {
    setUpdatedStatus(_status);
  };

  return (
    <div className="grid w-full grid-cols-12 divide-x divide-gray-500 text-base">
      <Dropdown
        className="col-span-3 p-2"
        placeHolder="Status"
        onChange={onChange}
      >
        <Dropdown.Option
          value={TASK_STATUS.BACKLOG}
          label={TASK_STATUS.BACKLOG}
        />
        <Dropdown.Option
          value={TASK_STATUS.NEW_REQUEST}
          label={TASK_STATUS.NEW_REQUEST}
        />
        <Dropdown.Option
          value={TASK_STATUS.IN_PROGRESS}
          label={TASK_STATUS.IN_PROGRESS}
        />
        <Dropdown.Option
          value={TASK_STATUS.COMPLETE}
          label={TASK_STATUS.COMPLETE}
        />
      </Dropdown>
      <div className="col-span-9 flex items-center p-2">
        <span className="px-1 py-px">{updatedStatus}</span>
      </div>
      <input
        type="text"
        id="task-status"
        name="task-status"
        value={updatedStatus}
        readOnly
        hidden
      />
    </div>
  );
};

const TagSelector = ({ tags }: { tags: ITag[] }) => {
  const [selected, setSelected] = useState(tags);
  const { allTags } = useAllTags();
  const [isAddNewTag, setIsAddNewTag] = useState(false);
  const colorPickerRef = useRef<HTMLInputElement>(null);
  const newTagNameRef = useRef<HTMLInputElement>(null);

  const addTag = (tagStr: string) => {
    const tag = JSON.parse(tagStr) as ITag;
    setSelected((prevState) => {
      const newState = [...prevState];
      if (
        !newState.find(
          (_tag) => _tag.name === tag.name && _tag.color === tag.color,
        )
      ) {
        newState.push(tag);
      }
      return newState;
    });
  };

  const removeTag = (index: number) => {
    setSelected((prevState) => {
      const newState = [...prevState];
      newState.splice(index, 1);
      return newState;
    });
  };

  const addNewTag = () => {
    if (colorPickerRef.current && newTagNameRef.current) {
      const color = colorPickerRef.current.value;
      const name = newTagNameRef.current.value.trim();
      if (name === "") return;
      const newTag: ITag = {
        name,
        color,
      };
      addTag(JSON.stringify(newTag));
      setIsAddNewTag(false);
      colorPickerRef.current.value = "#808080";
      newTagNameRef.current.value = "";
    }
  };

  return (
    <div className="grid w-full grid-cols-12 divide-x divide-gray-500 text-sm md:text-base">
      <Dropdown className="col-span-3 p-2" placeHolder="Tags" onChange={addTag}>
        {allTags.map((tag, i) => (
          <Dropdown.Option
            key={`${tag.name}-${i.toString()}`}
            value={JSON.stringify(tag)}
            label={tag.name}
          />
        ))}
      </Dropdown>
      <div className="group col-span-9 flex flex-wrap items-center gap-2 p-2">
        {selected.map((tag, i) => (
          <Tag
            key={`${tag.name}-${i.toString()}`}
            tag={tag}
            onClose={() => removeTag(i)}
          />
        ))}
        {isAddNewTag ? (
          <div className="flex w-full items-center rounded-sm border border-solid border-gray-500 p-1">
            <datalist id="colors">
              {Object.keys(COLOR_TABLE).map((color) => (
                <option key={color} value={COLOR_TABLE[color]} />
              ))}
            </datalist>
            <input
              ref={colorPickerRef}
              type="color"
              className="color-picker size-5 cursor-pointer border-0 bg-transparent focus:outline-0"
              value={COLOR_TABLE[0]}
              list="colors"
            />
            <input
              ref={newTagNameRef}
              type="text"
              className="flex-1 bg-transparent px-1 focus:outline-0"
              placeholder="New Tag Name"
            />
            <button
              type="button"
              onClick={addNewTag}
              className="rounded-sm px-1 hover:bg-gray-500/30"
            >
              + New Tag
            </button>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setIsAddNewTag(true)}
            className="invisible rounded-sm border border-dashed border-gray-500 px-1 py-px transition-all hover:bg-gray-500/30 group-hover:visible"
          >
            + New Tag
          </button>
        )}
      </div>
      <input
        type="text"
        id="task-tags"
        name="task-tags"
        value={JSON.stringify(selected)}
        readOnly
        hidden
      />
    </div>
  );
};
