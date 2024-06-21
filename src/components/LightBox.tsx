import { HTMLAttributes, ReactNode } from "react";

interface Props extends HTMLAttributes<HTMLDivElement> {
  label: string | ReactNode;
  option?: {
    lightBoxStyle?: string;
  };
}

export const LightBox = (props: Props) => {
  const { children, className = "", label, option, ...legacy } = props;
  const { lightBoxStyle = "" } = option ?? {
    lightBoxStyle: "",
  };

  return (
    <div {...legacy} className={`${className} group relative`}>
      <div className="transition-all group-hover:text-yellow-300">{label}</div>
      <div className="absolute left-2 top-full grid min-w-[160px] grid-rows-[0fr] transition-[grid-template-rows] duration-300 group-hover:grid-rows-[1fr]">
        <div className="overflow-hidden">
          <div
            className={`${lightBoxStyle} relative mt-2 break-words rounded-md rounded-tl-none bg-yellow-200 p-2 text-sm text-gray-800 before:absolute before:-top-2 before:left-0 before:border-8 before:border-solid before:border-transparent before:border-l-yellow-200`}
          >
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};
