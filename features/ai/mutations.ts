import { useMutation } from "@tanstack/react-query";

import { requestAiSummary } from "./api";
import type { AiSummaryRequest } from "./types";

function useRequestAiSummaryMutation() {
  return useMutation({
    mutationFn: (payload: AiSummaryRequest) => requestAiSummary(payload),
  });
}

export { useRequestAiSummaryMutation };
