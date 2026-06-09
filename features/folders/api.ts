import { api } from "@/lib/api-client";

import type {
  CreateFolderRequest,
  CreateFolderResponse,
  GetFoldersParams,
  GetFoldersResponse,
  UpdateFolderRequest,
  UpdateFolderResponse,
} from "./types";

async function getFolders(params: GetFoldersParams = {}) {
  return api.get<GetFoldersResponse>("/api/folders", { params });
}

async function createFolder(payload: CreateFolderRequest) {
  return api.post<CreateFolderResponse, CreateFolderRequest>("/api/folders", payload);
}

async function updateFolder(id: number, payload: UpdateFolderRequest) {
  return api.put<UpdateFolderResponse, UpdateFolderRequest>(`/api/folders/${id}`, payload);
}

export { createFolder, getFolders, updateFolder };
