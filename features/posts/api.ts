import { api } from "@/lib/api-client";

import type {
  CreatePostRequest,
  CreatePostResponse,
  GetPostResponse,
  GetPostsParams,
  GetPostsResponse,
} from "./types";

async function getPosts(params: GetPostsParams = {}) {
  return api.get<GetPostsResponse>("/api/posts", { params });
}

async function getPost(id: string | number) {
  return api.get<GetPostResponse>(`/api/posts/${id}`);
}

async function createPost(payload: CreatePostRequest) {
  return api.post<CreatePostResponse, CreatePostRequest>("/api/posts", payload);
}

export { createPost, getPost, getPosts };
