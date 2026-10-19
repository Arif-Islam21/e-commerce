import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"
import { categories } from "@/lib/db/collections"
import { categoryInputSchema } from "@/lib/catalog-schemas"
import { failure, success } from "@/lib/api/response"
import { requireAdmin } from "@/lib/auth-guards"

export async function GET(request: NextRequest) {
  try {
    const query = request.nextUrl.searchParams
    const filter = query.get("includeInactive") === "true" ? {} : { isActive: true }
    const rows = await (await categories()).find(filter).sort({ name: 1 }).toArray()
    return success(rows.map(({ _id, ...category }) => ({ id: _id?.toString(), ...category })))
  } catch { return failure("CATEGORIES_READ_FAILED", "Unable to load categories", 500) }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const parsed = categoryInputSchema.safeParse(await request.json())
    if (!parsed.success) return failure("VALIDATION_ERROR", "Invalid category data", 400, parsed.error.flatten())
    const now = new Date()
    const result = await (await categories()).insertOne({ ...parsed.data, isActive: parsed.data.isActive ?? true, createdAt: now, updatedAt: now })
    return success({ id: result.insertedId.toString(), ...parsed.data, isActive: parsed.data.isActive ?? true, createdAt: now, updatedAt: now }, 201)
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("CATEGORY_CREATE_FAILED", "Unable to create category", 500)
  }
}
