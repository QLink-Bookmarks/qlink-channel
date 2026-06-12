import { useMutation } from "@tanstack/react-query";

import { createLink, deleteLink, setLinkFavorite, updateLink } from "./api";
import type { CreateLinkRequest, SetLinkFavoriteRequest, UpdateLinkRequest } from "./types";

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

function useSetLinkFavoriteMutation() {
  return useMutation({
    mutationFn: ({
      linkId,
      payload,
    }: {
      linkId: string | number;
      payload: SetLinkFavoriteRequest;
    }) => setLinkFavorite(linkId, payload),
  });
}

export {
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useSetLinkFavoriteMutation,
  useUpdateLinkMutation,
};
