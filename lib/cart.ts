import { ObjectId } from "mongodb"
import { carts, products } from "@/lib/db/collections"
import type { CartDocument, CartItem, ProductDocument } from "@/lib/db/types"

export const GUEST_CART_COOKIE = "guest_cart_id"

export function cartOwner(userId?: ObjectId, guestId?: string) {
  return userId ? { userId } : { guestId }
}

export async function validateCartItem(productId: string, quantity: number, variant?: Record<string, string>) {
  if (!ObjectId.isValid(productId) || !Number.isInteger(quantity) || quantity <= 0 || quantity > 99) return { error: "Invalid product or quantity" as const }
  const product = await (await products()).findOne({ _id: new ObjectId(productId), status: "active" }) as ProductDocument | null
  if (!product) return { error: "Product unavailable" as const }
  if (quantity > product.stock) return { error: "Requested quantity exceeds stock" as const }
  if (variant) for (const option of product.variants) if (variant[option.name] && !option.options.includes(variant[option.name])) return { error: `Invalid ${option.name} variant` as const }
  return { product }
}

export function serializeCart(cart: CartDocument | null) {
  return { id: cart?._id?.toString(), items: (cart?.items ?? []).map((item) => ({ ...item, productId: item.productId.toString() })), createdAt: cart?.createdAt, updatedAt: cart?.updatedAt }
}

export async function getOrCreateCart(owner: { userId?: ObjectId; guestId?: string }) {
  const collection = await carts()
  let cart = await collection.findOne(cartOwner(owner.userId, owner.guestId))
  if (!cart) { const now = new Date(); const result = await collection.insertOne({ ...owner, items: [], createdAt: now, updatedAt: now }); cart = { _id: result.insertedId, ...owner, items: [], createdAt: now, updatedAt: now } }
  return cart
}

export function mergeCartItems(items: CartItem[], next: CartItem) {
  const index = items.findIndex((item) => item.productId.equals(next.productId) && JSON.stringify(item.variant ?? {}) === JSON.stringify(next.variant ?? {}))
  if (index === -1) return [...items, next]
  const merged = [...items]; merged[index] = { ...merged[index], quantity: merged[index].quantity + next.quantity }; return merged
}
