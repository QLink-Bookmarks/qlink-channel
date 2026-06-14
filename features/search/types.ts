type SearchMode = "both" | "link" | "web";

type WebSearchResult = {
  id: string;
  title: string;
  url: string;
  displayUrl: string;
  snippet: string;
};

export type { SearchMode, WebSearchResult };
