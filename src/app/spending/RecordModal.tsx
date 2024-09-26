"use client";

import { RecordEditor } from "@/app/spending/RecordEditor";
import { useFocusRef } from "@/hooks/useFocusRef";
import { IRecord } from "@/type";
import { DEFAULT_CATEGORIES, RecordModalType } from "@/utils/constants";
import { useRecordModalCtx, useUserStoreCtx } from "@/utils/externalStores";
import {
  ChangeEvent,
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react";
import { IoCheckmarkCircleOutline, IoChevronBack } from "react-icons/io5";
import { v4 as uuidv4 } from "uuid";

export const RecordModal = () => {
  const { useStore } = useRecordModalCtx();
  const [state] = useStore((state) => state);
  const ref = useFocusRef<HTMLDivElement>(() => {
    if (state.open) state.onClose();
  });
  const [, startTransition] = useTransition();

  useEffect(() => {
    const modalElementRef = ref.current;
    if (modalElementRef) {
      startTransition(() => {
        if (state.open) {
          modalElementRef.classList.remove("translate-y-full");
          modalElementRef.classList.add("translate-y-0");
        } else {
          modalElementRef.classList.remove("translate-y-0");
          modalElementRef.classList.add("translate-y-full");
        }
      });
    }
  }, [ref, state.open]);

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 top-0 z-50 flex flex-col items-center justify-end bg-transparent ${state.open ? "translate-y-0" : "translate-y-full delay-500"}`}
    >
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-black/50 backdrop-blur-sm"></div>
      <div
        ref={ref}
        className="flex w-full translate-y-full flex-col gap-4 rounded-t-2xl bg-gray-800 p-8 transition-all duration-300 md:w-auto"
        style={{
          minWidth: ref.current?.clientWidth,
          minHeight: ref.current?.clientHeight,
        }}
      >
        {state.step === RecordModalType.Step_1 && <Calculator />}
        {state.step === RecordModalType.Step_2 && <CategorySelector />}
        {state.step === RecordModalType.Step_3 && (
          <AddResult loading={state.loading} />
        )}
        {state.step === RecordModalType.Step_4 && (
          <RecordEditor loading={state.loading} />
        )}
      </div>
    </div>
  );
};

const OPERATORS = ["/", "x", "-", "+"];
const Calculator = () => {
  const { useStore: useUserStore } = useUserStoreCtx();
  const [email] = useUserStore((state) => state.email);
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);
  const [record] = useStore((state) => state.record);
  const [sign, setSign] = useState(record?.price ? record?.price > 0 : false);
  const [total, setTotal] = useState(
    record?.price ? Math.abs(record.price).toString() : "",
  );
  const [temp, setTemp] = useState<string[]>([]);

  const handleOnEnterNumber = useCallback((val: string) => {
    setTotal((prevTotal) => {
      if (prevTotal === "") return val;
      return prevTotal + val;
    });
    setTemp((prevState) => {
      const newState = [...prevState];
      const last = newState[newState.length - 1];
      if (last && !OPERATORS.includes(last)) {
        newState.pop();
        newState.push(last + val);
      } else {
        newState.push(val);
      }
      return newState;
    });
  }, []);

  const handleOnSetOperator = useCallback((val: string) => {
    setTotal((prevTotal) => {
      const last = prevTotal.charAt(prevTotal.length - 1);
      if (prevTotal !== "" && !OPERATORS.includes(last)) {
        return prevTotal + val;
      } else if (OPERATORS.includes(last)) {
        return prevTotal.slice(0, prevTotal.length - 1) + val;
      }
      return prevTotal;
    });
    setTemp((prevState) => {
      const newState = [...prevState];
      const last = newState[newState.length - 1];
      if (last && OPERATORS.includes(last)) {
        newState.pop();
        newState.push(val);
      } else if (last) {
        newState.push(val);
      }
      return newState;
    });
  }, []);

  const handleOnNextStep = useCallback(() => {
    setState({
      step: RecordModalType.Step_2,
      record: record
        ? {
            ...record,
            price: sign ? Number(total) : -Number(total),
            date: new Date().toISOString().split("T")[0],
            time: new Date().toISOString().split("T")[1],
          }
        : {
            id: uuidv4(),
            price: sign ? Number(total) : -Number(total),
            category: "",
            date: new Date().toISOString().split("T")[0],
            time: new Date().toISOString().split("T")[1],
            desc: "",
            email,
          },
    });
  }, [email, record, setState, sign, total]);

  const handleOnCalculate = useCallback(() => {
    if (temp.length > 0) {
      const _temp: string[] = [];
      let index = 0;
      while (index < temp.length) {
        const val = temp[index];
        if ((val === "/" || val === "x") && index + 1 !== temp.length) {
          const prev = _temp.pop();
          const next = temp[index + 1];
          if (prev && !OPERATORS.includes(prev) && !OPERATORS.includes(next)) {
            _temp.push(calculate(Number(prev), Number(next), val));
            index += 2;
          }
        } else {
          _temp.push(val);
          index++;
        }
      }

      let res = "";
      let _operator = "";
      _temp.forEach((val) => {
        if (res === "") {
          res = val;
        } else if (OPERATORS.includes(val)) {
          _operator = val;
        } else if (_operator !== "") {
          res = calculate(Number(res), Number(val), _operator);
        }
      });
      setTotal(res);
      setTemp([]);
    }
  }, [temp]);

  const clearOutput = useCallback(() => {
    setTotal("");
    setTemp([]);
  }, []);

  return (
    <>
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center">
          <button
            className={`rounded-l-md px-4 py-1 font-semibold text-gray-800 transition-colors ${sign ? "bg-red-300/60 hover:bg-red-300/70" : "bg-red-300"}`}
            onClick={() => setSign(false)}
          >
            支出
          </button>
          <button
            className={`rounded-r-md px-4 py-1 font-semibold text-gray-800 transition-colors ${sign ? "bg-green-300" : "bg-green-300/60 hover:bg-green-300/70"}`}
            onClick={() => setSign(true)}
          >
            收入
          </button>
        </div>
        <button
          className="flex items-center justify-center rounded-md bg-stone-400 px-4 py-1 transition-colors hover:bg-stone-300"
          onClick={clearOutput}
        >
          <span className="font-semibold text-gray-800">C</span>
        </button>
      </div>

      <div className="w-full rounded-md bg-stone-400 px-3 py-4 text-right font-bold text-gray-800">
        {total || 0}
      </div>

      <div className="grid w-full grid-cols-4 gap-2">
        <div className="col-span-3 grid grid-cols-3 gap-2">
          {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", "."].map((v) => (
            <button
              key={v}
              className="col-span-1 flex items-center justify-center rounded-md bg-stone-400 px-4 py-2 transition-colors hover:bg-stone-300"
              onClick={() => handleOnEnterNumber(v)}
            >
              <span className="font-semibold text-gray-800">{v}</span>
            </button>
          ))}
          <button
            className="col-span-1 flex items-center justify-center rounded-md bg-stone-400 px-4 py-2 transition-colors hover:bg-stone-300"
            onClick={handleOnCalculate}
          >
            <span className="font-semibold text-gray-800">=</span>
          </button>
        </div>
        <div className="col-span-1 flex flex-col gap-2">
          {OPERATORS.map((v) => (
            <button
              key={v}
              className="flex items-center justify-center rounded-md bg-stone-400 px-4 py-2 transition-colors hover:bg-stone-300"
              onClick={() => handleOnSetOperator(v)}
            >
              <span className="font-semibold text-gray-800">{v}</span>
            </button>
          ))}
          <button
            className="flex items-center justify-center rounded-md bg-stone-400 px-2 py-2 transition-colors hover:bg-stone-300"
            onClick={handleOnNextStep}
          >
            <span className="font-semibold text-gray-800">下一步</span>
          </button>
        </div>
      </div>
    </>
  );
};

const CategorySelector = () => {
  const { useStore } = useRecordModalCtx();
  const [state, setState] = useStore((state) => state);
  const [desc, setDesc] = useState("");

  const handleOnPreviousStep = useCallback(() => {
    setState({
      step: RecordModalType.Step_1,
    });
  }, [setState]);

  const handleOnSelectCategory = useCallback(
    (val: string) => {
      setState({
        record: {
          ...(state.record as IRecord),
          category: val,
        },
      });
    },
    [setState, state.record],
  );

  const handleOnChangeDesc = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      setDesc(event.target.value);
    },
    [],
  );

  const handleOnBlurDesc = useCallback(() => {
    setState({
      record: {
        ...(state.record as IRecord),
        desc,
      },
    });
  }, [desc, setState, state.record]);

  const handleOnSubmit = useCallback(() => {
    if (state.record && state.record.category !== "") {
      state.addRecord(state.record);
      setState({
        step: RecordModalType.Step_3,
      });
    }
  }, [setState, state]);

  return (
    <>
      <div className="flex w-full items-center pb-2">
        <button
          className="flex items-center gap-2 transition-colors hover:text-green-50-500"
          onClick={handleOnPreviousStep}
        >
          <IoChevronBack className="size-5" />
          <span>上一步</span>
        </button>
      </div>

      <fieldset className="rounded-md border border-solid border-b-gray-d0-500">
        <legend className="ml-2 bg-gray-800 px-2">說明文字</legend>
        <input
          type="text"
          placeholder="ex: 麵包"
          className="w-full bg-transparent px-2 pb-2 focus:outline-none"
          onChange={handleOnChangeDesc}
          onBlur={handleOnBlurDesc}
          defaultValue={state.record?.desc}
        />
      </fieldset>

      <div className="grid w-full grid-cols-4 gap-2">
        {DEFAULT_CATEGORIES.concat([]).map((_category) => (
          <button
            key={_category}
            className={`col-span-1 flex items-center justify-center rounded-md px-4 py-2 transition-colors ${state.record?.category === _category ? "bg-stone-300" : "bg-stone-400 hover:bg-stone-300"}`}
            onClick={() => handleOnSelectCategory(_category)}
          >
            <span className="font-semibold text-gray-800">{_category}</span>
          </button>
        ))}
      </div>

      <div className="flex w-full flex-1 items-end pt-4">
        <button
          className="flex w-full items-center justify-center rounded-md bg-blue-5F-500/80 px-4 py-2 transition-colors hover:bg-blue-5F-500"
          onClick={handleOnSubmit}
        >
          <span className="font-semibold text-gray-800">送出</span>
        </button>
      </div>
    </>
  );
};

const AddResult = ({ loading }: { loading: boolean }) => {
  const { useStore } = useRecordModalCtx();
  const [, setState] = useStore((state) => state);
  const [onClose] = useStore((state) => state.onClose);

  const handleOnKeepInputNext = useCallback(() => {
    setState({
      step: RecordModalType.Step_1,
      record: undefined,
    });
  }, [setState]);

  return (
    <div className="flex h-full w-full justify-center">
      {loading ? (
        <div className="m-auto">
          <div className="loader-square"></div>
        </div>
      ) : (
        <div className="flex w-full flex-col justify-between gap-4">
          <div className="flex items-center justify-center gap-2">
            <IoCheckmarkCircleOutline className="size-8 text-green-500" />
            <span className="text-lg font-bold">完成</span>
          </div>
          <div className="flex w-full flex-col gap-2">
            <button
              className="flex w-full items-center justify-center rounded-md bg-blue-5F-500/80 px-4 py-2 font-bold text-gray-800 transition-colors hover:bg-blue-5F-500"
              onClick={onClose}
            >
              結束輸入
            </button>
            <button
              className="flex w-full items-center justify-center rounded-md bg-green-50-500/80 px-4 py-2 font-bold text-gray-800 transition-colors hover:bg-green-50-500"
              onClick={handleOnKeepInputNext}
            >
              繼續輸入下一筆
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function calculate(num1: number, num2: number, operator: string) {
  switch (operator) {
    case "/":
      return (num1 / num2).toString();
    case "x":
      return (num1 * num2).toString();
    case "-":
      return (num1 - num2).toString();
    case "+":
      return (num1 + num2).toString();
    default:
      return (num1 + num2).toString();
  }
}
