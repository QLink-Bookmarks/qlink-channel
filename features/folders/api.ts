import { api } from "@/lib/api-client";

import type {
  AcceptFolderInvitationRequest,
  AcceptFolderInvitationResponse,
  CreateFolderInvitationRequest,
  CreateFolderInvitationResponse,
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

async function createFolderInvitation(id: number, payload: CreateFolderInvitationRequest) {
  return api.post<CreateFolderInvitationResponse, CreateFolderInvitationRequest>(
    `/api/folders/${id}`,
    payload,
  );
}

async function acceptFolderInvitation(id: number, payload: AcceptFolderInvitationRequest) {
  return api.put<AcceptFolderInvitationResponse, AcceptFolderInvitationRequest>(
    `/api/folders/${id}/members`,
    payload,
  );
}

async function updateFolder(id: number, payload: UpdateFolderRequest) {
  return api.put<UpdateFolderResponse, UpdateFolderRequest>(`/api/folders/${id}`, payload);
}

export { acceptFolderInvitation, createFolder, createFolderInvitation, getFolders, updateFolder };
