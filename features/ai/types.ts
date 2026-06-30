import type { AiProviderType } from "@/features/account/types";
import type { ApiEnvelope } from "@/features/links/types";

type AiProviderModel = {
  id: number;
  model: string;
  priority: number;
  userProviderId: number;
};

type AiProviderWithModels = {
  providerId: number;
  providerType: AiProviderType;
  models: AiProviderModel[];
};

type GetAiProviderModelsResponse = ApiEnvelope<AiProviderWithModels[]>;

type PutAiUserProviderRequest = {
  providerId: number;
  apiKey: string;
};

type PutAiUserProviderResponseData = {
  id: number;
};

type PutAiUserProviderResponse = ApiEnvelope<PutAiUserProviderResponseData>;

type AiSummaryRequest = {
  id?: number | null;
  folderId?: number | null;
  userProviderId: number;
  modelId: number;
  url: string;
  title?: string | null;
  generateTodo?: boolean;
};

type AiSummaryResponseData = {
  id: number;
};

type AiSummaryResponse = ApiEnvelope<AiSummaryResponseData>;

export type {
  AiProviderModel,
  AiProviderWithModels,
  AiSummaryRequest,
  AiSummaryResponse,
  AiSummaryResponseData,
  GetAiProviderModelsResponse,
  PutAiUserProviderRequest,
  PutAiUserProviderResponse,
  PutAiUserProviderResponseData,
};
