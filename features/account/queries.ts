import { useQuery } from "@tanstack/react-query";

import { getMySettings } from "./api";

const accountQueryKeys = {
  mySettings: () => ["account", "settings"] as const,
};

function useMySettingsQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getMySettings();
      return response.data;
    },
    queryKey: accountQueryKeys.mySettings(),
  });
}

export { accountQueryKeys, useMySettingsQuery };
