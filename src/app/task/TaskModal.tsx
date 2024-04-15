"use client";

import { useTaskCtx } from "@/app/task/CtxTask";
import { Dropdown } from "@/components/Dropdown";
import { useFocusRef } from "@/hooks/useFocusRef";
import { IMongoQueryRes, ITodo } from "@/type";
import {
  COLOR_TABLE,
  TASK_COLOR,
  TASK_STATUS,
  TASK_TABLE,
} from "@/utils/constants";
import { setTodo } from "@/utils/setTodo";
import { updateTodo } from "@/utils/updateTodo";
import { useSession } from "next-auth/react";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { IoClose } from "react-icons/io5";

interface Props {
  task: ITodo;
  open: boolean;
  action: "update" | "add";
  onClose: () => void;
  handleLoading: (status: boolean) => void;
}

export const TaskModal = (props: Props) => {
  const { task, open, action, onClose, handleLoading } = props;
  const { data: session } = useSession();
  const ref = useFocusRef<HTMLFormElement>(() => {
    onClose();
  });
  const { reFetch } = useTaskCtx();
  const initRef = useRef(false);
  const [newTags, setNewTags] = useState(JSON.stringify(task.tags));

  function resetFormData() {
    (ref.current as HTMLFormElement).reset();
  }

  function handleOnSubmit(event: FormEvent) {
    event.preventDefault();
    const formData = new FormData(event.target as HTMLFormElement);
    const title = (formData.get("title") ?? task.title) as string;
    const status = {
      name: (formData.get("status") ?? task.status.name) as TASK_STATUS,
    };
    const tags = JSON.parse(newTags) as { name: string; color: TASK_COLOR }[];
    const iat = formData.get("iat")
      ? new Date(formData.get("iat") as string)
      : undefined;
    const expiry = formData.get("expiry")
      ? new Date(formData.get("expiry") as string)
      : undefined;
    const detail = formData.get("detail") as string;
    handleLoading(true);
    if (action === "update") {
      updateTodo(task, {
        ...task,
        title,
        status,
        tags,
        iat,
        expiry,
        detail,
      })
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          handleLoading(false);
          reFetch().finally();
        });
    } else if (action === "add") {
      setTodo({
        ...task,
        title,
        status,
        tags,
        iat,
        expiry,
        detail,
        userEmail: session?.user?.email ?? "",
      })
        .then((res: IMongoQueryRes) => {
          console.log(res.status, JSON.parse(res.message));
        })
        .finally(() => {
          handleLoading(false);
          reFetch().finally();
        });
    } else {
      handleLoading(false);
    }
    resetFormData();
    onClose();
  }

  function handleOnAddTag(data: { name: string; color: string }) {
    setNewTags((prevState) => {
      const newState = prevState;
      if (newState !== "") {
        const newOne = JSON.parse(newState) as {
          name: string;
          color: string;
        }[];
        newOne.push(data);
        return JSON.stringify(newOne);
      } else {
        return JSON.stringify(data);
      }
    });
  }

  function handleOnRemoveTag(data: { name: string; color: string }) {
    setNewTags((prevState) => {
      const newState = prevState;
      if (newState !== "") {
        const newOne = JSON.parse(newState) as {
          name: string;
          color: string;
        }[];
        const i = newOne.findIndex(
          (d) => JSON.stringify(d) === JSON.stringify(data),
        );
        if (i !== -1) newOne.splice(i, 1);
        return JSON.stringify(newOne);
      } else {
        return newState;
      }
    });
  }

  useEffect(() => {
    if (props.open) {
      initRef.current = true;
      ref.current?.classList.remove("opacity-0");
      ref.current?.classList.add("opacity-100");
      setTimeout(
        () => {
          ref.current?.classList.remove("animate-slideOut-to-bottom");
          ref.current?.classList.add("animate-slideIn-from-bottom");
        },
        initRef.current ? 0 : 150,
      );
    } else {
      ref.current?.classList.remove("animate-slideIn-from-bottom");
      ref.current?.classList.add("animate-slideOut-to-bottom");
      setTimeout(() => {
        ref.current?.classList.remove("opacity-100");
        ref.current?.classList.add("opacity-0");
      }, 150);
    }
  }, [props.open, ref]);

  return (
    <div
      className={`fixed z-40 left-0 right-0 top-0 bottom-0 bg-black/50 md:items-center flex justify-center items-end transition-opacity duration-0 ${open ? "opacity-100 pointer-events-auto" : "delay-300 opacity-0 pointer-events-none"}`}
    >
      <form
        ref={ref}
        onSubmit={handleOnSubmit}
        className="relative flex flex-col bg-[#403F44] p-5 max-w-[800px] md:py-8 md:px-10 rounded-t-2xl md:rounded-2xl w-full md:w-2/3 md:max-h-5/6"
      >
        <button
          type="button"
          className="size-6 absolute top-4 right-4"
          onClick={onClose}
        >
          <IoClose className="w-full h-full text-black/50 hover:text-black transition-all" />
        </button>
        <div className="pb-4">
          <input
            type="text"
            name="title"
            className="text-2xl border pr-6 border-solid bg-transparent border-transparent transition-all hover:border-gray-d0-500"
            defaultValue={task.title}
          />
        </div>
        <div className="pb-4 flex items-center gap-4 flex-wrap">
          <StatusPicker value={task.status.name} />
          <div className="flex items-center gap-4 flex-wrap">
            <input
              type="date"
              name="iat"
              className="bg-transparent text-gray-d0-500 border border-solid border-gray-d0-500 px-2 py-1 rounded-md"
              defaultValue={formatDateString(task.iat ?? new Date())}
            />
            <span>-</span>
            <input
              type="date"
              name="expiry"
              className="bg-transparent text-gray-d0-500 border border-solid border-gray-d0-500 px-2 py-1 rounded-md"
              defaultValue={formatDateString(task.expiry ?? new Date())}
            />
          </div>
        </div>
        <div className="pb-4 flex items-center">
          <TagPicker
            label="Tag"
            color={TASK_COLOR.LIGHT_GRAY}
            addOne={handleOnAddTag}
          />
          <input
            name="tag-colors"
            className="invisible w-0 h-0"
            type="text"
            value={newTags}
            readOnly
          />
        </div>
        <div className="pb-4 flex items-center gap-4">
          {JSON.parse(newTags).map((tag: { name: string; color: string }) => (
            <div key={`${tag.name}-${tag.color}`} className="relative group">
              <span
                className="rounded-full px-2 py-1 text-black select-none"
                style={{ backgroundColor: tag.color }}
              >
                {tag.name}
              </span>
              <button
                type="button"
                title="Delete Tag"
                onClick={() => handleOnRemoveTag(tag)}
                className="absolute flex items-center justify-center z-20 -top-2 -right-2 hover:bg-red-ff-500 size-4 rounded-full bg-red-ff-500/50 opacity-0 group-hover:opacity-100 transition-all pointer-events-none group-hover:pointer-events-auto"
              >
                <IoClose />
              </button>
            </div>
          ))}
        </div>
        <div className="pb-4 flex flex-col">
          <span className="mb-2 select-none">Detail</span>
          <textarea
            name="detail"
            rows={8}
            className="w-full bg-transparent border border-solid border-gray-d0-500 rounded-md resize-none px-2 py-1"
            defaultValue={task.detail}
          />
        </div>
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2 text-gray-500 hover:text-red-ff-500 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-5F-500 rounded-md transition-colors hover:bg-blue-00-500 hover:text-white"
          >
            Save Change
          </button>
        </div>
      </form>
    </div>
  );
};

interface TagPickerProps {
  label: string;
  value?: string;
  color?: string;
  addOne: (data: { name: string; color: string }) => void;
}

const TagPicker = (props: TagPickerProps) => {
  const { label, value, color, addOne } = props;
  const [selectedColor, setSelectedColor] = useState(color);
  const [text, setText] = useState(value ?? "");

  const handleOnChangeColor = (_color: string) => {
    setSelectedColor(_color);
  };

  const handleOnChangeText = (event: ChangeEvent) => {
    const target = event.target as HTMLInputElement;
    setText(target.value);
  };

  const handleAddOne = useCallback(() => {
    if (text !== "" && selectedColor && addOne) {
      addOne({
        name: text,
        color: selectedColor,
      });
      setText("");
      setSelectedColor(undefined);
    }
  }, [addOne, selectedColor, text]);

  const handleOnEnterText = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleAddOne();
      }
    },
    [handleAddOne],
  );

  return (
    <div className="rounded-lg flex flex-col gap-2 w-full md:w-fit">
      <span>{label}</span>
      <div className="flex items-center flex-wrap gap-2">
        <div className="relative">
          <input
            name={`${label}-text`}
            type="text"
            className="p-2 px-10 bg-transparent border border-solid border-gray-d0-500 rounded-md"
            value={text}
            onKeyDown={handleOnEnterText}
            onChange={handleOnChangeText}
          />
          <div className="absolute left-3 top-0 bottom-0 flex items-center justify-center">
            <ColorSelector
              onChange={handleOnChangeColor}
              color={selectedColor}
            />
          </div>
        </div>
        <input
          name={`${label}-color`}
          className="invisible w-0 h-0"
          type="text"
          value={selectedColor ?? ""}
          readOnly
        />
        <button
          type="button"
          onClick={handleAddOne}
          className="border border-solid border-gray-d0-500 rounded-md size-10 transition-colors hover:bg-gray-d0-500 hover:text-black active:bg-transparent active:text-gray-d0-500"
        >
          +
        </button>
      </div>
    </div>
  );
};

interface StatusPickerProps {
  value: TASK_STATUS;
}

const StatusPicker = (props: StatusPickerProps) => {
  const { value } = props;
  const [text, setText] = useState(value);

  function handleOnChange(option: string) {
    setText(option as TASK_STATUS);
  }

  return (
    <div className="rounded-lg flex items-center gap-2 w-full md:w-fit">
      <div className="flex items-center flex-wrap gap-4">
        <StatusSelector status={text} onChange={handleOnChange} />
        <input
          name="status"
          className="invisible w-0 h-0"
          type="text"
          value={text ?? ""}
          readOnly
        />
      </div>
    </div>
  );
};

const ColorSelector = ({
  onChange,
  color,
}: {
  onChange: (option: string) => void;
  color?: string;
}) => {
  return (
    <Dropdown
      onChange={onChange}
      value={color}
      option={{ showTriangle: false, showValue: false }}
      className="rounded-md p-2 border border-solid border-gray-d0-500"
      style={{
        backgroundColor: color ?? "#D0D0D0",
      }}
    >
      {Object.entries(COLOR_TABLE).map(([label, value]) => (
        <Dropdown.Option
          key={label}
          label={label}
          value={value}
          prefix={
            <span
              style={{
                backgroundColor: value,
              }}
              className="size-4"
            ></span>
          }
        />
      ))}
    </Dropdown>
  );
};

const StatusSelector = ({
  onChange,
  status,
}: {
  onChange: (option: string) => void;
  status: TASK_STATUS;
}) => {
  return (
    <Dropdown
      onChange={onChange}
      value={status}
      className="rounded-lg p-3 shadow-sm border border-solid border-gray-d0-500"
    >
      {Object.entries(TASK_TABLE).map(([label, value]) => (
        <Dropdown.Option key={label} label={label} value={value} />
      ))}
    </Dropdown>
  );
};

function formatDateString(date: Date) {
  const day = ("0" + new Date(date).getDate()).slice(-2);
  const month = ("0" + (new Date(date).getMonth() + 1)).slice(-2);
  return `${new Date(date).getFullYear()}-${month}-${day}`;
}
