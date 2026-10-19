import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"
import { categories, products } from "@/lib/db/collections"
import { categoryInputSchema } from "@/lib/catalog-schemas"
import { failure, success } from "@/lib/api/response"
import { requireAdmin } from "@/lib/auth-guards"

type Context = { params: Promise<{ id: string }> }
function parseId(id: string) { return ObjectId.isValid(id) ? new ObjectId(id) : null }

export async function GET(_: NextRequest, context: Context) {
  const { id } = await context.params
  const objectId = parseId(id)
  if (!objectId) return failure("INVALID_ID", "Invalid category id", 400)
  const category = await (await categories()).findOne({ _id: objectId })
  if (!category) return failure("NOT_FOUND", "Category not found", 404)
  return success({ id: category._id?.toString(), ...category, _id: undefined })
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const objectId = parseId(id)
    if (!objectId) return failure("INVALID_ID", "Invalid category id", 400)
    const parsed = categoryInputSchema.partial().safeParse(await request.json())
    if (!parsed.success) return failure("VALIDATION_ERROR", "Invalid category data", 400, parsed.error.flatten())
    const result = await (await categories()).findOneAndUpdate({ _id: objectId }, { $set: { ...parsed.data, updatedAt: new Date() } }, { returnDocument: "after" })
    if (!result) return failure("NOT_FOUND", "Category not found", 404)
    return success({ id: result._id?.toString(), ...result, _id: undefined })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("CATEGORY_UPDATE_FAILED", "Unable to update category", 500)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const objectId = parseId(id)
    if (!objectId) return failure("INVALID_ID", "Invalid category id", 400)
    const inUse = await (await products()).countDocuments({ categoryId: objectId, status: { $ne: "archived" } })
    if (inUse > 0) return failure("CATEGORY_IN_USE", "Archive the category while products still use it", 409)
    const result = await (await categories()).deleteOne({ _id: objectId })
    if (!result.deletedCount) return failure("NOT_FOUND", "Category not found", 404)
    return success({ deleted: true })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("CATEGORY_DELETE_FAILED", "Unable to delete category", 500)
  }
}
