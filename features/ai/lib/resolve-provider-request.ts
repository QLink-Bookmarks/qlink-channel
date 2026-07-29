import type { AiProviderWithModels } from "../types";

type AiProviderRequestTarget = {
  userProviderId: number;
  modelId: number;
};

// Turn a picked provider into the ids a summary request needs. Only the
// isMine=true payload carries userProviderId, so `mine` must come from there —
// the public catalog leaves it null and cannot be used here.
function resolveProviderRequest(
  mine: AiProviderWithModels[] | undefined,
  providerId: number | null,
): AiProviderRequestTarget | null {
  if (!mine?.length) {
    return null;
  }
  const provider = mine.find((entry) => entry.providerId === providerId) ?? mine[0];
  const model = [...provider.models]
    .sort((a, b) => a.priority - b.priority)
    .find((entry) => entry.userProviderId != null);
  if (!model?.userProviderId) {
    return null;
  }
  return { modelId: model.id, userProviderId: model.userProviderId };
}

export { resolveProviderRequest };
export type { AiProviderRequestTarget };
