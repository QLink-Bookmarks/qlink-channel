import { useQuery } from "@tanstack/react-query";

import { getLinkDetail } from "./api";

function getLinkDetailQueryKey(linkId?: string | number | null) {
  return ["links", "detail", linkId == null ? null : String(linkId)] as const;
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

export { getLinkDetailQueryKey, useLinkDetailQuery };
