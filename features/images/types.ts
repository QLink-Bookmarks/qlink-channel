import type { ApiEnvelope } from "@/features/links/types";

type UploadImageResponseData = {
  url: string;
};

type UploadImageResponse = ApiEnvelope<UploadImageResponseData>;

// Web picks a File/Blob; native (expo-image-picker) yields a `{ uri, name, type }`
// descriptor that React Native's FormData accepts for multipart upload.
type NativeImageFile = { uri: string; name: string; type: string };
type ImageUploadInput = File | Blob | NativeImageFile;

export type { ImageUploadInput, NativeImageFile, UploadImageResponse, UploadImageResponseData };
