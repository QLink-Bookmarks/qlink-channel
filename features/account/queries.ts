import { useQuery } from "@tanstack/react-query";

import { getMyProfile, getMySettings } from "./api";

const accountQueryKeys = {
  myProfile: () => ["account", "profile"] as const,
  mySettings: () => ["account", "settings"] as const,
};

function useMyProfileQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getMyProfile();
      return response.data;
    },
    queryKey: accountQueryKeys.myProfile(),
  });
}

function useMySettingsQuery() {
  return useQuery({
    queryFn: async () => {
      const response = await getMySettings();
      return response.data;
    },
    queryKey: accountQueryKeys.mySettings(),
  });
}

export { accountQueryKeys, useMyProfileQuery, useMySettingsQuery };
