import type { ApiResponse, Paginated, ProductListQuery, ApiProduct, ApiCategory } from "@/lib/api/types"

export class ApiClientError extends Error {
  code: string
  status: number
  details?: unknown
  constructor(message: string, code: string, status: number, details?: unknown) { super(message); this.name = "ApiClientError"; this.code = code; this.status = status; this.details = details }
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(path, { ...init, credentials: "include", headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) } })
  const body = await response.json() as ApiResponse<T>
  if (!response.ok || !body.success) {
    const error = body.success ? { code: "HTTP_ERROR", message: response.statusText } : body.error
    throw new ApiClientError(error.message, error.code, response.status, "details" in error ? error.details : undefined)
  }
  return body.data
}

function queryString(params: object) {
  const search = new URLSearchParams()
  for (const [key, value] of Object.entries(params as Record<string, string | number | undefined>)) if (value !== undefined && value !== "") search.set(key, String(value))
  const value = search.toString()
  return value ? `?${value}` : ""
}

export const api = {
  listCategories: (params?: { page?: number; pageSize?: number; search?: string }) => request<Paginated<ApiCategory>>(`/api/categories${queryString(params ?? {})}`),
  getCategory: (id: string) => request<ApiCategory>(`/api/categories/${encodeURIComponent(id)}`),
  listProducts: (params?: ProductListQuery) => request<Paginated<ApiProduct>>(`/api/products${queryString(params ?? {})}`),
  getProduct: (id: string) => request<ApiProduct>(`/api/products/${encodeURIComponent(id)}`),
}
