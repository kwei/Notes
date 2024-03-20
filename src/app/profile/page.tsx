import { ReactNode } from "react";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-col items-center">
      <div className="flex flex-col rounded-3xl border border-solid border-gray-d0-500 my-4 max-w-1/2">
        <Block label="Summary">
          <span>Kai-Wei Yeh (KW Yeh, 葉鎧瑋)</span>
        </Block>
        <Block label="Achievements">
          <span>我的成就</span>
        </Block>
        <Block label="Education／Work Experience">
          <span>學經歷</span>
        </Block>
        <Block label="Skills">
          <span>技能</span>
        </Block>
      </div>
    </main>
  );
}

const Block = ({ children, label }: { children: ReactNode; label: string }) => {
  return (
    <div className="p-8 last:border-b-0 border-b border-solid border-gray-d0-500 flex flex-col gap-4">
      <h4>{label}</h4>
      {children}
    </div>
  );
};
