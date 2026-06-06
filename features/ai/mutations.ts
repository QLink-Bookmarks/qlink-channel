import { useMutation, useQueryClient } from "@tanstack/react-query";

import { putAiUserProvider, requestAiSummary } from "./api";
import { aiQueryKeys } from "./queries";
import type { AiSummaryRequest, PutAiUserProviderRequest } from "./types";

function useRequestAiSummaryMutation() {
  return useMutation({
    mutationFn: (payload: AiSummaryRequest) => requestAiSummary(payload),
  });
}

function usePutAiUserProviderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PutAiUserProviderRequest) => putAiUserProvider(payload),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: aiQueryKeys.providerModels() });
    },
  });
}

export { usePutAiUserProviderMutation, useRequestAiSummaryMutation };
