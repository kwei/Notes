import { ReactNode } from "react";

export const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => {
  return (
    <div
      className={`rounded-3xl border border-solid border-gray-d0-500 p-4 ${className}`}
    >
      {children}
    </div>
  );
};
