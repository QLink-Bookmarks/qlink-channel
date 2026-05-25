import { api } from "@/lib/api-client";

import type {
  CreateLinkRequest,
  CreateLinkResponse,
  DeleteLinkResponse,
  LinkDetailResponse,
  UpdateLinkRequest,
} from "./types";

async function createLink(payload: CreateLinkRequest) {
  return api.post<CreateLinkResponse, CreateLinkRequest>("/api/links", payload);
}

async function getLinkDetail(linkId: string | number) {
  return api.get<LinkDetailResponse>(`/api/links/${linkId}`);
}

async function updateLink(linkId: string | number, payload: UpdateLinkRequest) {
  return api.put<LinkDetailResponse, UpdateLinkRequest>(`/api/links/${linkId}`, payload);
}

async function deleteLink(linkId: string | number) {
  return api.delete<DeleteLinkResponse>(`/api/links/${linkId}`);
}

export { createLink, deleteLink, getLinkDetail, updateLink };
