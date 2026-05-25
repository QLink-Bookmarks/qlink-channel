import { useMutation } from "@tanstack/react-query";

import { createLink, deleteLink, updateLink } from "./api";
import type { CreateLinkRequest, UpdateLinkRequest } from "./types";

function useCreateLinkMutation() {
  return useMutation({
    mutationFn: (payload: CreateLinkRequest) => createLink(payload),
  });
}

function useUpdateLinkMutation(linkId: string | number) {
  return useMutation({
    mutationFn: (payload: UpdateLinkRequest) => updateLink(linkId, payload),
  });
}

function useDeleteLinkMutation(linkId: string | number) {
  return useMutation({
    mutationFn: () => deleteLink(linkId),
  });
}

export { useCreateLinkMutation, useDeleteLinkMutation, useUpdateLinkMutation };
