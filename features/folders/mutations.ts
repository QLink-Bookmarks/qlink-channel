import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFolder, createFolderInvitation, updateFolder } from "./api";
import { folderQueryKeys } from "./queries";
import type {
  CreateFolderInvitationRequest,
  CreateFolderRequest,
  UpdateFolderRequest,
} from "./types";

function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFolderRequest) => createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderQueryKeys.all });
    },
  });
}

function useUpdateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: UpdateFolderRequest }) =>
      updateFolder(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderQueryKeys.all });
    },
  });
}

function useCreateFolderInvitationMutation() {
  return useMutation({
    mutationFn: ({ id, payload }: { id: number; payload: CreateFolderInvitationRequest }) =>
      createFolderInvitation(id, payload),
  });
}

export { useCreateFolderInvitationMutation, useCreateFolderMutation, useUpdateFolderMutation };
