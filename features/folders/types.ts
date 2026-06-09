import type { ApiEnvelope } from "@/features/links/types";

type Folder = {
  id: number;
  ownerId?: number;
  ownerNickname?: string | null;
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

type CreateFolderRequest = {
  name: string;
  emoji?: string | null;
  isShared?: boolean | null;
};

type CreateFolderResponse = ApiEnvelope<{ id: number }>;

type UpdateFolderRequest = {
  name: string;
  emoji?: string | null;
  isShared?: boolean | null;
};

type UpdateFolderResponse = ApiEnvelope<{ id: number }>;

export type {
  CreateFolderRequest,
  CreateFolderResponse,
  Folder,
  FolderOrder,
  FolderScrollResponse,
  GetFoldersParams,
  GetFoldersResponse,
  UpdateFolderRequest,
  UpdateFolderResponse,
};
