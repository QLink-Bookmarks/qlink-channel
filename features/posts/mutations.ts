import { useMutation, useQueryClient } from "@tanstack/react-query";

import { createPost } from "./api";
import type { CreatePostRequest } from "./types";

function useCreatePostMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreatePostRequest) => createPost(payload),
    onSuccess: (_response, variables) => {
      void queryClient.invalidateQueries({ queryKey: ["posts", "list", variables.type] });
    },
  });
}

export { useCreatePostMutation };
