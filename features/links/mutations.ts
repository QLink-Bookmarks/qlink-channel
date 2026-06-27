import { useMutation } from "@tanstack/react-query";

import { copySharedFolderLink, createLink, deleteLink, setLinkFavorite, updateLink } from "./api";
import type {
  CopyLinkRequest,
  CreateLinkRequest,
  SetLinkFavoriteRequest,
  UpdateLinkRequest,
} from "./types";

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

function useCopyLinkMutation(linkId: string | number) {
  return useMutation({
    mutationFn: (payload: CopyLinkRequest) => copySharedFolderLink(linkId, payload),
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
  useCopyLinkMutation,
  useCreateLinkMutation,
  useDeleteLinkMutation,
  useSetLinkFavoriteMutation,
  useUpdateLinkMutation,
};
