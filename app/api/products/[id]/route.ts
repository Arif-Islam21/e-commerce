import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"
import { products, categories } from "@/lib/db/collections"
import { productInputSchema } from "@/lib/catalog-schemas"
import { failure, success } from "@/lib/api/response"
import { requireAdmin } from "@/lib/auth-guards"

type Context = { params: Promise<{ id: string }> }
function parseId(id: string) { return ObjectId.isValid(id) ? new ObjectId(id) : null }
function format(product: Record<string, unknown>) { const { _id, categoryId, ...rest } = product; return { id: (_id as ObjectId)?.toString(), categoryId: (categoryId as ObjectId)?.toString(), ...rest } }

export async function GET(_: NextRequest, context: Context) {
  const { id } = await context.params
  const objectId = parseId(id)
  if (!objectId) return failure("INVALID_ID", "Invalid product id", 400)
  const product = await (await products()).findOne({ _id: objectId, status: "active" })
  if (!product) return failure("NOT_FOUND", "Product not found", 404)
  return success(format(product as unknown as Record<string, unknown>))
}

export async function PATCH(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const objectId = parseId(id)
    if (!objectId) return failure("INVALID_ID", "Invalid product id", 400)
    const parsed = productInputSchema.partial().safeParse(await request.json())
    if (!parsed.success) return failure("VALIDATION_ERROR", "Invalid product data", 400, parsed.error.flatten())
    const update: Record<string, unknown> = { ...parsed.data, updatedAt: new Date() }
    if (parsed.data.categoryId) {
      const category = await (await categories()).findOne({ _id: new ObjectId(parsed.data.categoryId), isActive: true })
      if (!category) return failure("CATEGORY_NOT_FOUND", "Active category not found", 400)
      update.categoryId = new ObjectId(parsed.data.categoryId)
    }
    const result = await (await products()).findOneAndUpdate({ _id: objectId }, { $set: update }, { returnDocument: "after" })
    if (!result) return failure("NOT_FOUND", "Product not found", 404)
    return success(format(result as unknown as Record<string, unknown>))
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("PRODUCT_UPDATE_FAILED", "Unable to update product", 500)
  }
}

export async function DELETE(request: NextRequest, context: Context) {
  try {
    await requireAdmin(request)
    const { id } = await context.params
    const objectId = parseId(id)
    if (!objectId) return failure("INVALID_ID", "Invalid product id", 400)
    const result = await (await products()).updateOne({ _id: objectId }, { $set: { status: "archived", updatedAt: new Date() } })
    if (!result.matchedCount) return failure("NOT_FOUND", "Product not found", 404)
    return success({ archived: true })
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("PRODUCT_DELETE_FAILED", "Unable to archive product", 500)
  }
}
