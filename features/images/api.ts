import { api } from "@/lib/api-client";

import type { UploadImageResponse } from "./types";

async function uploadImage(file: File | Blob) {
  const form = new FormData();
  form.append("image", file);
  return api.post<UploadImageResponse, FormData>("/api/images", form, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export { uploadImage };
