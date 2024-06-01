import { redirect } from "next/navigation";

export default function Home() {
  redirect("/spending");
  // return (
  //   <Suspense>
  //     <CheckArticle>
  //       <main className="grid w-full flex-1 grid-cols-5 h-full">
  //         <TopicList className="max-lg:hidden col-span-1" />
  //         <div className="flex h-full flex-col col-span-4 max-lg:col-span-5 :w-full items-center">
  //           <ArticleContainer />
  //           <Comment />
  //         </div>
  //       </main>
  //     </CheckArticle>
  //   </Suspense>
  // );
}
