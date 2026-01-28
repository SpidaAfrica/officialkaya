/* eslint-disable @typescript-eslint/no-unused-vars */
import { AxiosInstance } from "axios";
import { cleanErr } from "../error";

/**
 * Dynamic handler for API calls.
 * @template T - The expected type of the response data.
 * @param {string} endpoint - The API endpoint.
 * @param {object} req - The request payload.
 * @param {'post' | 'get' | 'patch' | 'put' | 'delete'} method - The HTTP method.
 * @param {AxiosInstance} client - The Axios instance for making the request.
 * @param {string} [reqErr] - Optional error message to include in the thrown error.
 * @returns {Promise<T>} A promise that resolves with the API response data.
 */

export async function handler<T, R = unknown>(
  endpoint: string,
  req: R,
  method: "post" | "get" | "patch" | "put" | "delete",
  client: AxiosInstance,
  reqErr?: string
): Promise<T> {
  try {
    const config = {
      url: endpoint,
      method: method,
      ...(method === "get" ? { params: req } : { data: req }),
    };
    const response = await client.request<T>(config);
    return response.data as T;
  } catch (err) {
    const error = err as Error;
    const errorMessage = cleanErr(error);
    throw new Error(errorMessage);
  }
}
