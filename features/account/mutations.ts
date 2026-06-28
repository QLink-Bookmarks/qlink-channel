import { useMutation, useQueryClient } from "@tanstack/react-query";

import { deleteMyAccount, updateMyProfile, updateMySettings } from "./api";
import { accountQueryKeys } from "./queries";
import type {
  DeleteMyAccountResponse,
  GetMyProfileResponseData,
  GetMySettingsResponseData,
  UpdateMyProfileRequest,
  UpdateMyProfileResponse,
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

function useUpdateMyProfileMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateMyProfileResponse, unknown, UpdateMyProfileRequest>({
    mutationFn: (payload) => updateMyProfile(payload),
    onSuccess: (response) => {
      const data = response.data;
      if (data) {
        queryClient.setQueryData<GetMyProfileResponseData>(accountQueryKeys.myProfile(), data);
      } else {
        void queryClient.invalidateQueries({ queryKey: accountQueryKeys.myProfile() });
      }
    },
  });
}

function useDeleteMyAccountMutation() {
  return useMutation<DeleteMyAccountResponse, unknown, void>({
    mutationFn: () => deleteMyAccount(),
  });
}

export { useDeleteMyAccountMutation, useUpdateMyProfileMutation, useUpdateMySettingsMutation };
