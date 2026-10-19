import { ObjectId } from "mongodb"
import { NextRequest } from "next/server"
import { products, categories } from "@/lib/db/collections"
import { productInputSchema } from "@/lib/catalog-schemas"
import { failure, success } from "@/lib/api/response"
import { requireAdmin } from "@/lib/auth-guards"

function publicProduct(product: Record<string, unknown>) {
  const { _id, categoryId, ...rest } = product
  return { id: (_id as ObjectId)?.toString(), categoryId: (categoryId as ObjectId)?.toString(), ...rest }
}

export async function GET(request: NextRequest) {
  try {
    const params = request.nextUrl.searchParams
    const page = Math.max(Number(params.get("page") ?? 1) || 1, 1)
    const limit = Math.min(Math.max(Number(params.get("limit") ?? 20) || 20, 1), 100)
    const search = params.get("search")?.trim()
    const filter: Record<string, unknown> = { status: "active" }
    if (search) filter.$or = [{ name: { $regex: search, $options: "i" } }, { description: { $regex: search, $options: "i" } }]
    if (params.get("categoryId") && ObjectId.isValid(params.get("categoryId")!)) filter.categoryId = new ObjectId(params.get("categoryId")!)
    const sortField = ["createdAt", "price", "name", "stock"].includes(params.get("sort") ?? "") ? params.get("sort")! : "createdAt"
    const direction = params.get("order") === "asc" ? 1 : -1
    const collection = await products()
    const [items, total] = await Promise.all([collection.find(filter).sort({ [sortField]: direction }).skip((page - 1) * limit).limit(limit).toArray(), collection.countDocuments(filter)])
    return success({ items: items.map((item) => publicProduct(item as unknown as Record<string, unknown>)), pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } })
  } catch { return failure("PRODUCTS_READ_FAILED", "Unable to load products", 500) }
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request)
    const parsed = productInputSchema.safeParse(await request.json())
    if (!parsed.success) return failure("VALIDATION_ERROR", "Invalid product data", 400, parsed.error.flatten())
    const category = await (await categories()).findOne({ _id: new ObjectId(parsed.data.categoryId), isActive: true })
    if (!category) return failure("CATEGORY_NOT_FOUND", "Active category not found", 400)
    const now = new Date()
    const document = { ...parsed.data, categoryId: new ObjectId(parsed.data.categoryId), createdAt: now, updatedAt: now }
    const result = await (await products()).insertOne(document)
    return success(publicProduct({ _id: result.insertedId, ...document } as unknown as Record<string, unknown>), 201)
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHENTICATED") return failure("UNAUTHENTICATED", "Authentication required", 401)
    if (error instanceof Error && error.message === "FORBIDDEN") return failure("FORBIDDEN", "Admin access required", 403)
    return failure("PRODUCT_CREATE_FAILED", "Unable to create product", 500)
  }
}
