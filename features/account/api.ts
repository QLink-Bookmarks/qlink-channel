import { api } from "@/lib/api-client";

import type { GetMySettingsResponse } from "./types";

async function getMySettings() {
  return api.get<GetMySettingsResponse>("/api/users/me/settings");
}

export { getMySettings };
