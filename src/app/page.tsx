import { Entry } from "@/app/Entry";
import { getArticleList } from "@/utils/getArticleList";

export default async function Home() {
  const articleList = await getArticleList();
  return <Entry articleList={articleList} />;
}
