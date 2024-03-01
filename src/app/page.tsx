import { Comment } from "@/components/Comment";
import { Editor } from "@/components/Editor";
import { SectionList } from "@/components/SectionList";
import { TopicList } from "@/components/TopicList";

export default function Home() {
  return (
    <main className="flex w-full flex-1 flex-row">
      <TopicList className="max-lg:hidden w-1/5" />
      <div className="flex flex-col h-full w-3/5 max-lg:w-full items-center">
        <SectionList className="lg:hidden w-full" />
        <Editor />
        <Comment />
      </div>
      <SectionList className="max-lg:hidden w-1/5" />
    </main>
  );
}
