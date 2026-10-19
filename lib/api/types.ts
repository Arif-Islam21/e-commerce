import type { CategoryDocument, ProductDocument, UserRole, OrderStatus } from "@/lib/db/types"

export interface ApiSuccess<T> { success: true; data: T }
export interface ApiError { success: false; error: { code: string; message: string; details?: unknown } }
export type ApiResponse<T> = ApiSuccess<T> | ApiError

export interface PaginationMeta { page: number; pageSize: number; total: number; totalPages: number; hasNextPage: boolean; hasPreviousPage: boolean }
export interface Paginated<T> { items: T[]; pagination: PaginationMeta }

export type ApiCategory = Omit<CategoryDocument, "_id"> & { id: string }
export type ApiProduct = Omit<ProductDocument, "_id" | "categoryId"> & { id: string; categoryId: string }
export interface ApiUser { id: string; email: string; name: string; role: UserRole; isEmailVerified: boolean; createdAt: string; updatedAt: string }
export interface ApiOrderSummary { id: string; total: number; currency: "BDT"; status: OrderStatus; createdAt: string; updatedAt: string }

export interface ListQuery { page?: number; pageSize?: number; sort?: string; order?: "asc" | "desc" }
export interface ProductListQuery extends ListQuery { search?: string; categoryId?: string; status?: "draft" | "active" | "archived"; minPrice?: number; maxPrice?: number }
