import { api } from "@/lib/api-client";

import type { GetFoldersParams, GetFoldersResponse } from "./types";

async function getFolders(params: GetFoldersParams = {}) {
  return api.get<GetFoldersResponse>("/api/folders", { params });
}

export { getFolders };
