import { useQuery } from "@tanstack/react-query";

import { getNotifications } from "./api";
import type { GetNotificationsParams } from "./types";

const notificationQueryKeys = {
  all: ["notifications"] as const,
  list: (params: GetNotificationsParams) => ["notifications", "list", params] as const,
};

function useNotificationsQuery(params: GetNotificationsParams = {}) {
  const resolvedParams: GetNotificationsParams = {
    order: "latest",
    size: 30,
    ...params,
  };

  return useQuery({
    queryFn: async () => {
      const response = await getNotifications(resolvedParams);
      return response.data;
    },
    queryKey: notificationQueryKeys.list(resolvedParams),
  });
}

export { notificationQueryKeys, useNotificationsQuery };
