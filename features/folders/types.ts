import type { ApiEnvelope } from "@/features/links/types";

type Folder = {
  id: number;
  name: string;
  emoji?: string | null;
  isShared: boolean;
  shareCounts: number;
  linkCounts: number;
};

type FolderScrollResponse = {
  isEmpty: boolean;
  contents: Folder[];
  nextCursor: string | null;
  hasNext: boolean;
};

type GetFoldersResponse = ApiEnvelope<FolderScrollResponse>;

type FolderOrder = "latest" | "earliest" | "laxico";

type GetFoldersParams = {
  query?: string;
  order?: FolderOrder;
  cursor?: string;
  size?: number;
};

export type { Folder, FolderOrder, FolderScrollResponse, GetFoldersParams, GetFoldersResponse };
