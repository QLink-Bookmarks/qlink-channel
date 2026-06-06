import { api } from "@/lib/api-client";

import type {
  AiSummaryRequest,
  AiSummaryResponse,
  GetAiProviderModelsResponse,
  PutAiUserProviderRequest,
  PutAiUserProviderResponse,
} from "./types";

async function getAiProviderModels() {
  return api.get<GetAiProviderModelsResponse>("/api/ai/providers/models");
}

async function requestAiSummary(payload: AiSummaryRequest) {
  return api.put<AiSummaryResponse, AiSummaryRequest>("/api/links/ai", payload);
}

async function putAiUserProvider(payload: PutAiUserProviderRequest) {
  return api.put<PutAiUserProviderResponse, PutAiUserProviderRequest>(
    "/api/ai/users/providers",
    payload,
  );
}

export { getAiProviderModels, putAiUserProvider, requestAiSummary };
