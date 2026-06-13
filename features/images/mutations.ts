import { useMutation } from "@tanstack/react-query";

import { uploadImage } from "./api";

function useUploadImageMutation() {
  return useMutation({
    mutationFn: (file: File | Blob) => uploadImage(file),
  });
}

export { useUploadImageMutation };
