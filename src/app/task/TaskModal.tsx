"use client";

import { Dropdown } from "@/components/Dropdown";
import { sortTags, useAllTags } from "@/hooks/useAllTags";
import { useFocusRef } from "@/hooks/useFocusRef";
import { IMongoQueryRes } from "@/type";
import {
  COLOR_TABLE,
  TASK_COLOR,
  TASK_STATUS,
  TASK_TABLE,
} from "@/utils/constants";
import { useTaskModalStoreCtx } from "@/utils/externalStores";
import { formatDateString } from "@/utils/formatDateString";
import { setTodo } from "@/utils/setTodo";
import { updateTodo } from "@/utils/updateTodo";
import {
  ChangeEvent,
  FormEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from "react";
import { IoMdArrowRoundForward } from "react-icons/io";
import { IoClose } from "react-icons/io5";

export const TaskModal = () => {
  const { useStore: useTaskModalStore } = useTaskModalStoreCtx();
  const [info] = useTaskModalStore((state) => state);
  const { task, open, action, onClose, handleLoading } = info;
  const { allTags } = useAllTags();
  const [newTags, setNewTags] = useState(JSON.stringify(task.tags));
  const handleOnClose = useCallback(() => {
    setNewTags(JSON.stringify(task.tags));
    onClose();
  }, [onClose, task.tags]);
  const ref = useFocusRef<HTMLFormElement>(() => {
    handleOnClose();
  });

  const resetFormData = useCallback(() => {
    (ref.current as HTMLFormElement).reset();
  }, [ref]);

  const handleOnSubmit = useCallback(
    (event: FormEvent) => {
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
        })
          .then((res: IMongoQueryRes) => {
            console.log(res.status, JSON.parse(res.message));
          })
          .finally(() => {
            handleLoading(false);
          });
      } else {
        handleLoading(false);
      }
      resetFormData();
      handleOnClose();
    },
    [action, handleLoading, handleOnClose, newTags, resetFormData, task],
  );

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

  function handleSelectExistedTag(tagStringify: string) {
    const data = JSON.parse(tagStringify);
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

  useEffect(() => {
    setNewTags(JSON.stringify(task.tags));
  }, [task.tags]);

  if (!open) return null;
  return (
    <div className="fixed z-40 left-0 right-0 top-0 bottom-0 bg-black/50 md:items-center flex justify-center items-end">
      <form
        ref={ref}
        onSubmit={handleOnSubmit}
        className="relative flex flex-col bg-[#403F44] p-5 max-w-[800px] md:py-8 md:px-10 rounded-t-2xl md:rounded-2xl w-full md:w-2/3 md:max-h-5/6 animate-slideIn-from-bottom"
      >
        <button
          type="button"
          className="size-6 absolute top-4 right-4"
          onClick={handleOnClose}
        >
          <IoClose className="w-full h-full text-black/50 hover:text-black transition-all" />
        </button>
        <div className="pb-4">
          <input
            type="text"
            name="title"
            className="text-2xl border pr-6 w-full border-solid bg-transparent border-transparent transition-all hover:border-gray-d0-500"
            defaultValue={task.title}
          />
        </div>

        <div className="mb-2 flex gap-4 flex-wrap">
          <fieldset className="py-2">
            <legend className="px-4 bg-gray-500 rounded-sm">任務狀態</legend>
            <StatusPicker value={task.status.name} />
          </fieldset>
          <fieldset className="p-2 flex items-center gap-2">
            <legend className="px-4 bg-gray-500 rounded-sm">起訖</legend>
            <input
              type="date"
              name="iat"
              className="bg-transparent text-gray-d0-500 px-2 h-7 border-b border-solid border-gray-d0-500"
              defaultValue={task.iat ? formatDateString(task.iat) : ""}
            />
            <IoMdArrowRoundForward className="size-4" />
            <input
              type="date"
              name="expiry"
              className="bg-transparent text-gray-d0-500 px-2 h-7 border-b border-solid border-gray-d0-500"
              defaultValue={task.expiry ? formatDateString(task.expiry) : ""}
            />
          </fieldset>
        </div>

        <fieldset className="mb-2 py-2 flex items-center flex-wrap">
          <legend className="px-4 bg-gray-500 rounded-sm">標籤</legend>
          <TagPicker color={TASK_COLOR.LIGHT_GRAY} addOne={handleOnAddTag} />
          <input
            name="tag-colors"
            className="invisible w-0 h-0"
            type="text"
            value={newTags}
            readOnly
          />
          <div className="md:w-fit w-full pt-4">
            <Dropdown
              onChange={handleSelectExistedTag}
              placeHolder="Add Existed Tag"
              className="border border-solid border-gray-d0-500 rounded-lg p-1 pr-4 md:w-fit w-full"
            >
              {allTags.map((tag) => (
                <Dropdown.Option
                  key={tag.name}
                  label={tag.name}
                  value={JSON.stringify(tag)}
                  style={{ borderColor: tag.color }}
                  className="border-l-4 border-solid rounded-l-none"
                />
              ))}
            </Dropdown>
          </div>
        </fieldset>
        <div className="mb-4 flex items-center gap-2 flex-wrap">
          {sortTags(JSON.parse(newTags)).map(
            (tag: { name: string; color: string }) => (
              <div key={`${tag.name}-${tag.color}`} className="relative group">
                <span
                  className="rounded-full px-2 py-1 text-black select-none break-anywhere text-sm"
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
            ),
          )}
        </div>
        <fieldset className="mb-4 px-2 pb-2 flex flex-col border border-solid border-gray-d0-500 rounded-md">
          <legend className="px-2 select-none">內容</legend>
          <textarea
            name="detail"
            rows={8}
            className="w-full bg-transparent resize-none px-2 py-1 focus:outline-0"
            defaultValue={task.detail}
          />
        </fieldset>
        <div className="flex items-center justify-end gap-4">
          <button
            type="button"
            onClick={handleOnClose}
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
  value?: string;
  color?: string;
  addOne: (data: { name: string; color: string }) => void;
}

const TagPicker = (props: TagPickerProps) => {
  const { value, color, addOne } = props;
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
    <div className="rounded-lg flex flex-col gap-2 w-full">
      <div className="flex w-full items-center flex-wrap">
        <div className="relative w-full md:w-fit">
          <input
            name="tag-text"
            type="text"
            className="w-full md:w-fit p-2 px-10 bg-transparent border border-solid border-gray-d0-500 rounded-md"
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
          <div className="absolute right-0 top-0 bottom-0 flex items-center justify-center border-l border-solid border-gray-d0-500">
            <button
              type="button"
              onClick={handleAddOne}
              className="rounded-r-md text-xl h-full px-3 transition-colors hover:bg-gray-d0-500 hover:text-black active:bg-transparent active:text-gray-d0-500"
            >
              +
            </button>
          </div>
        </div>
        <input
          name="tag-color"
          className="invisible w-0 h-0"
          type="text"
          value={selectedColor ?? ""}
          readOnly
        />
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
      className="pr-4 h-7 border-b border-solid border-gray-d0-500"
    >
      {Object.entries(TASK_TABLE).map(([label, value]) => (
        <Dropdown.Option key={label} label={label} value={value} />
      ))}
    </Dropdown>
  );
};
