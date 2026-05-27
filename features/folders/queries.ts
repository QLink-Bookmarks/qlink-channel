import { useQuery } from "@tanstack/react-query";

import { getFolders } from "./api";
import type { GetFoldersParams } from "./types";

const folderQueryKeys = {
  all: ["folders"] as const,
  list: (params: GetFoldersParams) => ["folders", "list", params] as const,
};

function useFoldersQuery(params: GetFoldersParams = {}) {
  const resolvedParams: GetFoldersParams = {
    order: "latest",
    size: 15,
    ...params,
  };

  return useQuery({
    queryFn: async () => {
      const response = await getFolders(resolvedParams);
      return response.data;
    },
    queryKey: folderQueryKeys.list(resolvedParams),
  });
}

export { folderQueryKeys, useFoldersQuery };
