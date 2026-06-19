import { useMutation } from "@tanstack/react-query";

import { uploadImage } from "./api";
import type { ImageUploadInput } from "./types";

function useUploadImageMutation() {
  return useMutation({
    mutationFn: (file: ImageUploadInput) => uploadImage(file),
  });
}

export { useUploadImageMutation };
