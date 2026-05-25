import { DEV_AUTH_TOKEN } from "@/constants/auth";

import { type AxiosRequestConfig, create } from "axios";

export type ApiRequestConfig<D = unknown> = AxiosRequestConfig<D> & {
  authToken?: string | null;
};

export const apiClient = create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL,
  headers: {
    Accept: "application/json",
  },
  withCredentials: false,
});

function withAuth<D = unknown>(config: ApiRequestConfig<D> = {}): AxiosRequestConfig<D> {
  const { authToken, headers, ...axiosConfig } = config;
  // TODO: Replace this fallback with real authentication once auth is implemented.
  const token = authToken === undefined ? DEV_AUTH_TOKEN : authToken;

  return {
    ...axiosConfig,
    headers: {
      ...headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export const api = {
  async get<TResponse>(url: string, config?: ApiRequestConfig) {
    const response = await apiClient.get<TResponse>(url, withAuth(config));

    return response.data;
  },

  async post<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    const response = await apiClient.post<TResponse>(url, data, withAuth(config));

    return response.data;
  },

  async put<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    const response = await apiClient.put<TResponse>(url, data, withAuth(config));

    return response.data;
  },

  async patch<TResponse, TBody = unknown>(
    url: string,
    data?: TBody,
    config?: ApiRequestConfig<TBody>,
  ) {
    const response = await apiClient.patch<TResponse>(url, data, withAuth(config));

    return response.data;
  },

  async delete<TResponse>(url: string, config?: ApiRequestConfig) {
    const response = await apiClient.delete<TResponse>(url, withAuth(config));

    return response.data;
  },
};
