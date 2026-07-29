import { useQuery } from "@tanstack/react-query";

import { getAiProviderModels } from "./api";

const aiQueryKeys = {
  providerModels: (isMine: boolean) => ["ai", "provider-models", { isMine }] as const,
};

// Public catalog. Drives every provider picker and the model-rotation notice.
function useAiProviderCatalogQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getAiProviderModels(false);
      return response.data;
    },
    queryKey: aiQueryKeys.providerModels(false),
  });
}

// The caller's own providers — the only place userProviderId comes from, so a
// summary request has to be built on this, not on the catalog.
function useMyAiProvidersQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getAiProviderModels(true);
      return response.data;
    },
    queryKey: aiQueryKeys.providerModels(true),
  });
}

export { aiQueryKeys, useAiProviderCatalogQuery, useMyAiProvidersQuery };
