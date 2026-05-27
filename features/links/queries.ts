import { useQuery } from "@tanstack/react-query";

import { getLinkDetail, getLinks } from "./api";
import type { GetLinksParams } from "./types";

function getLinkDetailQueryKey(linkId?: string | number | null) {
  return ["links", "detail", linkId == null ? null : String(linkId)] as const;
}

function getLinksQueryKey(params: GetLinksParams) {
  return ["links", "list", params] as const;
}

function useLinkDetailQuery(linkId?: string | number | null) {
  return useQuery({
    enabled: Boolean(linkId),
    queryFn: async () => {
      const response = await getLinkDetail(linkId as string | number);
      return response.data;
    },
    queryKey: getLinkDetailQueryKey(linkId),
  });
}

function useLinksQuery(params: GetLinksParams = {}) {
  const resolvedParams: GetLinksParams = {
    order: "latest",
    size: 30,
    ...params,
  };

  return useQuery({
    queryFn: async () => {
      const response = await getLinks(resolvedParams);
      return response.data;
    },
    queryKey: getLinksQueryKey(resolvedParams),
  });
}

export { getLinkDetailQueryKey, getLinksQueryKey, useLinkDetailQuery, useLinksQuery };
