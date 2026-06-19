import { api } from "@/lib/api-client";

import type { ImageUploadInput, UploadImageResponse } from "./types";

async function uploadImage(file: ImageUploadInput) {
  const form = new FormData();
  // Native passes a `{ uri, name, type }` descriptor, which RN's FormData accepts
  // even though the DOM typings only allow string | Blob.
  form.append("image", file as unknown as Blob);
  // On native, omit Content-Type so RN's networking adds the multipart boundary
  // itself; a manual "multipart/form-data" without a boundary makes the upload fail.
  return api.post<UploadImageResponse, FormData>(
    "/api/images",
    form,
    process.env.EXPO_OS === "web"
      ? { headers: { "Content-Type": "multipart/form-data" } }
      : undefined,
  );
}

export { uploadImage };
