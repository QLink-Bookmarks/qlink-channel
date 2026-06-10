import { useMutation, useQueryClient } from "@tanstack/react-query";

import { readNotification, registerDevice } from "./api";
import { notificationQueryKeys } from "./queries";
import type { PutDeviceRequest, PutDeviceResponse } from "./types";

function useRegisterDeviceMutation() {
  return useMutation<PutDeviceResponse, unknown, PutDeviceRequest>({
    mutationFn: (payload) => registerDevice(payload),
  });
}

function useReadNotificationMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (notificationId: number | string) => readNotification(notificationId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: notificationQueryKeys.all });
    },
  });
}

export { useReadNotificationMutation, useRegisterDeviceMutation };
