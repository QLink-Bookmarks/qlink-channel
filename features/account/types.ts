import type { ApiEnvelope } from "@/features/links/types";

type AiProviderType = "GEMINI" | "CLAUDE" | "OPENAI";

type UserRole = "USER" | "ADMIN" | string;

type UserDefaultProvider = {
  id: number | null;
  type: AiProviderType | null;
};

type UserDefaultModel = {
  id: number | null;
  model: string | null;
};

type UserDisplaySettings = {
  theme: string;
  accent: string;
};

type UserBehaviorSettings = {
  allowsReminderNotification: boolean;
};

type UserAiSettings = {
  defaultProvider: UserDefaultProvider;
  defaultModel: UserDefaultModel;
};

type GetMySettingsResponseData = {
  display: UserDisplaySettings;
  behavior: UserBehaviorSettings;
  ai: UserAiSettings;
};

type GetMySettingsResponse = ApiEnvelope<GetMySettingsResponseData>;

type UpdateMySettingsRequest = {
  theme?: string | null;
  accent?: string | null;
  allowsReminder?: boolean | null;
  defaultProviderId?: number | null;
  defaultModelId?: number | null;
};

type UpdateMySettingsResponse = ApiEnvelope<GetMySettingsResponseData>;

type GetMyProfileResponseData = {
  id: number;
  username: string;
  nickname: string;
  role: UserRole;
  avatarUrl?: string | null;
  avatarEmoji?: string | null;
};

type GetMyProfileResponse = ApiEnvelope<GetMyProfileResponseData>;

type UpdateMyProfileRequest = {
  username: string;
  nickname: string;
  avatarEmoji?: string | null;
  avatarUrl?: string | null;
};

type UpdateMyProfileResponse = ApiEnvelope<GetMyProfileResponseData | null>;

export type {
  AiProviderType,
  GetMyProfileResponse,
  GetMyProfileResponseData,
  GetMySettingsResponse,
  GetMySettingsResponseData,
  UpdateMySettingsRequest,
  UpdateMySettingsResponse,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
  UserAiSettings,
  UserBehaviorSettings,
  UserDefaultModel,
  UserDefaultProvider,
  UserDisplaySettings,
};
