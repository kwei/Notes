import { giscusConfigs } from "@/config/giscusConfigs";
import Giscus from "@giscus/react";

export const Comment = () => {
  return (
    <div data-testid="comment" id="comment" className="w-full px-12 py-6">
      <Giscus
        repo={giscusConfigs.repo}
        repoId={giscusConfigs.repoId}
        category={giscusConfigs.category}
        categoryId={giscusConfigs.categoryId}
        mapping="pathname"
        reactionsEnabled="1"
        emitMetadata="0"
        inputPosition="top"
        theme="dark_dimmed"
        loading="lazy"
      />
    </div>
  );
};
