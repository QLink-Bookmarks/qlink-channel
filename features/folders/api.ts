import { api } from "@/lib/api-client";

import type {
  CreateFolderRequest,
  CreateFolderResponse,
  GetFoldersParams,
  GetFoldersResponse,
} from "./types";

async function getFolders(params: GetFoldersParams = {}) {
  return api.get<GetFoldersResponse>("/api/folders", { params });
}

async function createFolder(payload: CreateFolderRequest) {
  return api.post<CreateFolderResponse, CreateFolderRequest>("/api/folders", payload);
}

export { createFolder, getFolders };
