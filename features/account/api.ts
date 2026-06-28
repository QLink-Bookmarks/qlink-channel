import { api } from "@/lib/api-client";

import type {
  DeleteMyAccountResponse,
  GetMyProfileResponse,
  GetMySettingsResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  UpdateMySettingsRequest,
  UpdateMySettingsResponse,
} from "./types";

async function getMyProfile() {
  return api.get<GetMyProfileResponse>("/api/users/me");
}

async function getMySettings() {
  return api.get<GetMySettingsResponse>("/api/users/me/settings");
}

async function updateMySettings(payload: UpdateMySettingsRequest) {
  return api.patch<UpdateMySettingsResponse, UpdateMySettingsRequest>(
    "/api/users/me/settings",
    payload,
  );
}

async function updateMyProfile(payload: UpdateMyProfileRequest) {
  return api.put<UpdateMyProfileResponse, UpdateMyProfileRequest>("/api/users/me", payload);
}

async function deleteMyAccount() {
  return api.delete<DeleteMyAccountResponse>("/api/users/me");
}

export { deleteMyAccount, getMyProfile, getMySettings, updateMyProfile, updateMySettings };
