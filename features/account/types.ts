import type { ApiEnvelope } from "@/features/links/types";

type AiProviderType = "GEMINI" | "CLAUDE" | "OPENAI";

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

export type {
  AiProviderType,
  GetMySettingsResponse,
  GetMySettingsResponseData,
  UserAiSettings,
  UserBehaviorSettings,
  UserDefaultModel,
  UserDefaultProvider,
  UserDisplaySettings,
};
