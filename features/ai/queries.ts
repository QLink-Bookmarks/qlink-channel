import { useQuery } from "@tanstack/react-query";

import { getAiProviderModels } from "./api";

const aiQueryKeys = {
  providerModels: () => ["ai", "provider-models"] as const,
};

function useAiProviderModelsQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getAiProviderModels();
      return response.data;
    },
    queryKey: aiQueryKeys.providerModels(),
  });
}

export { aiQueryKeys, useAiProviderModelsQuery };
