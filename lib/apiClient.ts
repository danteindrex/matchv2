/**
 * Universal API client for Next.js frontend to interact with backend (proxied via API routes)
 */

export type ApiMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface ApiOptions {
  method?: ApiMethod;
  body?: any;
  headers?: Record<string, string>;
  token?: string;
  params?: Record<string, string>;
}

export interface ApiResponse<T = any> {
  data: T;
  error?: string;
  status: number;
}

/**
 * Main API fetch function for making requests to backend endpoints
 * @param endpoint - API endpoint path
 * @param options - Request options including method, body, headers, etc.
 * @returns Promise with typed response data, error message if any, and status code
 */
export async function apiFetch<T = any>(
  endpoint: string,
  { method = "GET", body, headers, token, params }: ApiOptions = {}
): Promise<ApiResponse<T>> {
  // Add query parameters if provided
  if (params && Object.keys(params).length > 0) {
    const queryString = new URLSearchParams(params).toString();
    endpoint = `${endpoint}${endpoint.includes('?') ? '&' : '?'}${queryString}`;
  }

  const fetchHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    ...(headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(endpoint, {
    method,
    headers: fetchHeaders,
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  let data: any = null;
  try { 
    data = await res.json(); 
  } catch {}

  if (!res.ok) {
    return { data, error: data?.message || data?.error || res.statusText, status: res.status };
  }
  return { data, status: res.status };
}

/**
 * Convenience wrapper for GET requests
 */
export async function apiGet<T = any>(
  endpoint: string, 
  options: Omit<ApiOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { ...options, method: "GET" });
}

/**
 * Convenience wrapper for POST requests
 */
export async function apiPost<T = any>(
  endpoint: string, 
  body: any, 
  options: Omit<ApiOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { ...options, body, method: "POST" });
}

/**
 * Convenience wrapper for PUT requests
 */
export async function apiPut<T = any>(
  endpoint: string, 
  body: any, 
  options: Omit<ApiOptions, 'method' | 'body'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { ...options, body, method: "PUT" });
}

/**
 * Convenience wrapper for DELETE requests
 */
export async function apiDelete<T = any>(
  endpoint: string, 
  options: Omit<ApiOptions, 'method'> = {}
): Promise<ApiResponse<T>> {
  return apiFetch<T>(endpoint, { ...options, method: "DELETE" });
}
