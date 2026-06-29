import type { ApiEnvelope } from "@/features/links/types";

type UpdateMyAgreementsRequest = {
  allowsPrivacy: boolean;
  allowsAiUsage: boolean;
};

type UpdateMyAgreementsResponse = ApiEnvelope<null>;

export type { UpdateMyAgreementsRequest, UpdateMyAgreementsResponse };
