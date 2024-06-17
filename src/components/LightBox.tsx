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
      <div
        className={`${lightBoxStyle} invisible absolute left-2 top-full mt-2 min-w-[150px] break-words rounded-md bg-yellow-300 p-2 text-sm text-gray-800 transition-all before:absolute before:-top-2 before:left-0 before:border-8 before:border-solid before:border-transparent before:border-l-yellow-400 group-hover:visible`}
      >
        {children}
      </div>
    </div>
  );
};
