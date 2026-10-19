import { z } from "zod"

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
})

export function getPagination(input: Record<string, string | string[] | undefined>) {
  const parsed = paginationSchema.parse({ page: input.page, limit: input.limit })
  return { ...parsed, skip: (parsed.page - 1) * parsed.limit }
}

export function paginationMeta(page: number, limit: number, total: number) {
  return { page, limit, total, totalPages: Math.ceil(total / limit) }
}
