import { ObjectId } from "mongodb"
import { randomUUID } from "node:crypto"
import { NextRequest } from "next/server"
import { carts } from "@/lib/db/collections"
import { failure, success } from "@/lib/api/response"
import { requireUser } from "@/lib/auth-guards"
import { GUEST_CART_COOKIE, getOrCreateCart, mergeCartItems, serializeCart, validateCartItem } from "@/lib/cart"

async function owner(request: NextRequest) {
  try { return { userId: (await requireUser(request))._id, guestId: undefined } } catch { return { userId: undefined, guestId: request.cookies.get(GUEST_CART_COOKIE)?.value ?? randomUUID() } }
}

export async function GET(request: NextRequest) { try { const current = await owner(request); const cart = await getOrCreateCart(current); return success(serializeCart(cart)) } catch { return failure("CART_READ_FAILED", "Unable to load cart", 500) } }

export async function POST(request: NextRequest) {
  try {
    const current = await owner(request); if (!current.userId && !current.guestId) return failure("GUEST_CART_REQUIRED", "Guest cart identifier is required", 400)
    const body = await request.json() as { productId?: string; quantity?: number; variant?: Record<string, string> }
    const checked = await validateCartItem(body.productId ?? "", body.quantity ?? 0, body.variant); if ("error" in checked) return failure("CART_ITEM_INVALID", checked.error ?? "Invalid cart item", 400)
    const cart = await getOrCreateCart(current); const items = mergeCartItems(cart.items, { productId: new ObjectId(body.productId), quantity: body.quantity!, variant: body.variant });
    const itemErrors = await Promise.all(items.map((item) => validateCartItem(item.productId.toString(), item.quantity, item.variant))); if (itemErrors.some((item) => "error" in item)) return failure("CART_STOCK_INVALID", "Cart contains unavailable stock", 409)
    await (await carts()).updateOne({ _id: cart._id }, { $set: { items, updatedAt: new Date() } }); return success(serializeCart({ ...cart, items, updatedAt: new Date() }))
  } catch { return failure("CART_UPDATE_FAILED", "Unable to update cart", 500) }
}

export async function PATCH(request: NextRequest) {
  try { const current = await owner(request); const body = await request.json() as { productId?: string; quantity?: number; variant?: Record<string, string> }; const checked = await validateCartItem(body.productId ?? "", body.quantity ?? 0, body.variant); if ("error" in checked) return failure("CART_ITEM_INVALID", checked.error ?? "Invalid cart item", 400); const cart = await getOrCreateCart(current); const items = cart.items.map((item) => item.productId.toString() === body.productId && JSON.stringify(item.variant ?? {}) === JSON.stringify(body.variant ?? {}) ? { ...item, quantity: body.quantity! } : item); await (await carts()).updateOne({ _id: cart._id }, { $set: { items, updatedAt: new Date() } }); return success(serializeCart({ ...cart, items, updatedAt: new Date() })) } catch { return failure("CART_UPDATE_FAILED", "Unable to update cart", 500) }
}

export async function DELETE(request: NextRequest) { try { const current = await owner(request); const cart = await getOrCreateCart(current); const productId = request.nextUrl.searchParams.get("productId"); const items = productId ? cart.items.filter((item) => item.productId.toString() !== productId) : []; await (await carts()).updateOne({ _id: cart._id }, { $set: { items, updatedAt: new Date() } }); return success(serializeCart({ ...cart, items, updatedAt: new Date() })) } catch { return failure("CART_UPDATE_FAILED", "Unable to clear cart", 500) } }
