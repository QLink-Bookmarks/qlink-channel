import { api } from "@/lib/api-client";

import type { AiSummaryRequest, AiSummaryResponse, GetAiProviderModelsResponse } from "./types";

async function getAiProviderModels() {
  return api.get<GetAiProviderModelsResponse>("/api/ai/providers/models");
}

async function requestAiSummary(payload: AiSummaryRequest) {
  return api.put<AiSummaryResponse, AiSummaryRequest>("/api/links/ai", payload);
}

export { getAiProviderModels, requestAiSummary };
