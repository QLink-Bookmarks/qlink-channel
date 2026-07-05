import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

import { getPost, getPosts } from "./api";
import type { GetPostsParams, PostType } from "./types";

type PostsListParams = Omit<GetPostsParams, "type" | "cursor">;

const postsQueryKeys = {
  all: ["posts"] as const,
  list: (type: PostType, params: PostsListParams = {}) => ["posts", "list", type, params] as const,
  detail: (id: string | number) => ["posts", "detail", String(id)] as const,
};

function usePostsQuery(type: PostType, params: PostsListParams = {}) {
  const size = params.size ?? 20;
  const resolvedParams: PostsListParams = { ...params, size };

  return useInfiniteQuery({
    queryKey: postsQueryKeys.list(type, resolvedParams),
    queryFn: async ({ pageParam }) => {
      const response = await getPosts({
        type,
        ...resolvedParams,
        cursor: pageParam ?? undefined,
      });
      return response.data;
    },
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) =>
      lastPage.hasNext ? (lastPage.nextCursor ?? undefined) : undefined,
  });
}

function usePostQuery(id: string | number) {
  return useQuery({
    queryKey: postsQueryKeys.detail(id),
    queryFn: async () => {
      const response = await getPost(id);
      return response.data;
    },
    // Surface 403/404 immediately instead of retrying a request that will keep failing.
    retry: false,
  });
}

export { postsQueryKeys, usePostQuery, usePostsQuery };
export type { PostsListParams };
