import { giscusConfigs } from "@/config/giscusConfigs";
import Giscus from "@giscus/react";

export const Comment = () => {
  return (
    <div data-testid="comment" id="comment" className="mx-auto py-6">
      <Giscus
        repo={giscusConfigs.repo}
        repoId={giscusConfigs.repoId}
        category={giscusConfigs.category}
        categoryId={giscusConfigs.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="light"
        loading="lazy"
      />
    </div>
  );
};
