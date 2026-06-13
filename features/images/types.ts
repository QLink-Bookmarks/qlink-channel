import type { ApiEnvelope } from "@/features/links/types";

type UploadImageResponseData = {
  url: string;
};

type UploadImageResponse = ApiEnvelope<UploadImageResponseData>;

export type { UploadImageResponse, UploadImageResponseData };
