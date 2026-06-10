import { useQuery } from "@tanstack/react-query";

import { getFolderMembers, getFolders } from "./api";
import type { GetFoldersParams } from "./types";

const folderQueryKeys = {
  all: ["folders"] as const,
  list: (params: GetFoldersParams) => ["folders", "list", params] as const,
  members: (id: number) => ["folders", "members", id] as const,
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

function useFolderMembersQuery(id: number, enabled = true) {
  return useQuery({
    enabled,
    queryFn: async () => {
      const response = await getFolderMembers(id);
      return response.data;
    },
    queryKey: folderQueryKeys.members(id),
  });
}

export { folderQueryKeys, useFolderMembersQuery, useFoldersQuery };
