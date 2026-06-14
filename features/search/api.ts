import type { WebSearchResult } from "./types";

const WEB_SEARCH_DELAY_MS = 300;

async function searchWeb(query: string): Promise<WebSearchResult[]> {
  const trimmed = query.trim();
  if (!trimmed) {
    return [];
  }

  await new Promise((resolve) => setTimeout(resolve, WEB_SEARCH_DELAY_MS));

  const encoded = encodeURIComponent(trimmed);
  return [
    {
      id: `web-google-${encoded}`,
      title: `Google에서 "${trimmed}" 검색`,
      url: `https://www.google.com/search?q=${encoded}`,
      displayUrl: "google.com",
      snippet: `웹에서 "${trimmed}" 관련 결과를 Google로 검색합니다.`,
    },
  ];
}

export { searchWeb };
