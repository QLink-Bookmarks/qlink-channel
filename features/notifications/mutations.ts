import { useMutation } from "@tanstack/react-query";

import { registerDevice } from "./api";
import type { PutDeviceRequest, PutDeviceResponse } from "./types";

function useRegisterDeviceMutation() {
  return useMutation<PutDeviceResponse, unknown, PutDeviceRequest>({
    mutationFn: (payload) => registerDevice(payload),
  });
}

export { useRegisterDeviceMutation };
