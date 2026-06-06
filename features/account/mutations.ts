import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMySettings } from "./api";
import { accountQueryKeys } from "./queries";
import type {
  GetMySettingsResponseData,
  UpdateMySettingsRequest,
  UpdateMySettingsResponse,
} from "./types";

function useUpdateMySettingsMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateMySettingsResponse, unknown, UpdateMySettingsRequest>({
    mutationFn: (payload) => updateMySettings(payload),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        queryClient.setQueryData<GetMySettingsResponseData>(accountQueryKeys.mySettings(), data);
      } else {
        void queryClient.invalidateQueries({ queryKey: accountQueryKeys.mySettings() });
      }
    },
  });
}

export { useUpdateMySettingsMutation };
