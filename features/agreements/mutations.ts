import { accountQueryKeys } from "@/features/account/queries";
import type { GetMyProfileResponseData } from "@/features/account/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateMyAgreements } from "./api";
import type { UpdateMyAgreementsRequest, UpdateMyAgreementsResponse } from "./types";

function useUpdateMyAgreementsMutation() {
  const queryClient = useQueryClient();
  return useMutation<UpdateMyAgreementsResponse, unknown, UpdateMyAgreementsRequest>({
    mutationFn: (payload) => updateMyAgreements(payload),
    onSuccess: (response, variables) => {
      if (!response?.success) {
        return;
      }
      // Flip the cached profile flags so the routing guard clears immediately,
      // before navigating home (avoids a redirect bounce back to /agreements).
      queryClient.setQueryData<GetMyProfileResponseData>(
        accountQueryKeys.myProfile(),
        (previous) =>
          previous
            ? {
                ...previous,
                allowsPrivacy: variables.allowsPrivacy,
                allowsAiUsage: variables.allowsAiUsage,
              }
            : previous,
      );
      void queryClient.invalidateQueries({ queryKey: accountQueryKeys.myProfile() });
    },
  });
}

export { useUpdateMyAgreementsMutation };
