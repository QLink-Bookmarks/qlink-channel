import { useMutation } from "@tanstack/react-query";

import { createLink } from "./api";
import type { CreateLinkRequest } from "./types";

function useCreateLinkMutation() {
  return useMutation({
    mutationFn: (payload: CreateLinkRequest) => createLink(payload),
  });
}

export { useCreateLinkMutation };
