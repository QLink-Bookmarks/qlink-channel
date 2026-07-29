import { api } from "@/lib/api-client";

import type { AiSummaryRequest, AiSummaryResponse, GetAiProviderModelsResponse } from "./types";

// isMine=false is the public catalog — every provider and the models the service
// rotates through, no bearer token needed. It carries no userProviderId, so it
// is for display only. isMine=true returns the caller's own providers, which is
// where userProviderId/modelId for a summary request come from.
async function getAiProviderModels(isMine: boolean) {
  return api.get<GetAiProviderModelsResponse>(`/api/ai/providers/models?isMine=${isMine}`);
}

async function requestAiSummary(payload: AiSummaryRequest) {
  return api.put<AiSummaryResponse, AiSummaryRequest>("/api/links/ai", payload);
}

export { getAiProviderModels, requestAiSummary };
