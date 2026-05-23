import { api } from "@/lib/api-client";

import type { CreateLinkRequest, CreateLinkResponse } from "./types";

async function createLink(payload: CreateLinkRequest) {
  return api.post<CreateLinkResponse, CreateLinkRequest>("/api/links", payload);
}

export { createLink };
