interface GitTreeObj {
  path: string;
  mode: string;
  type: string;
  sha: string;
  size: number;
  url: string;
}

interface GitTree {
  [category: string]: {
    [topic: string]: {
      fileName: string;
      fileUrl: string;
    }[];
  };
}

interface NotionObject {
  category: string;
  topic: string;
  name: string;
  id: string;
}

interface NotionProperty {
  Topic: {
    rich_text: {
      plain_text: string;
    }[];
  };
  Category: {
    rich_text: {
      plain_text: string;
    }[];
  };
  ID: {
    rich_text: {
      plain_text: string;
    }[];
  };
  Name: {
    title: {
      plain_text: string;
    }[];
  };
}

interface ArticleList {
  category: string;
  topic: string;
  name: string;
  id: string;
}
