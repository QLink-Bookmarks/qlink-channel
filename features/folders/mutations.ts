import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createFolder } from "./api";
import { folderQueryKeys } from "./queries";
import type { CreateFolderRequest } from "./types";

function useCreateFolderMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateFolderRequest) => createFolder(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: folderQueryKeys.all });
    },
  });
}

export { useCreateFolderMutation };
