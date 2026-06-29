import { api } from "@/lib/api-client";

import type { UpdateMyAgreementsRequest, UpdateMyAgreementsResponse } from "./types";

async function updateMyAgreements(payload: UpdateMyAgreementsRequest) {
  return api.put<UpdateMyAgreementsResponse, UpdateMyAgreementsRequest>(
    "/api/users/me/agreements",
    payload,
  );
}

export { updateMyAgreements };
