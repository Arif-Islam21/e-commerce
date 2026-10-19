import type { Collection } from "mongodb"
import { getDatabase } from "./client"
import type { CartDocument, CategoryDocument, CouponDocument, NewsletterDocument, OrderDocument, PaymentDocument, ProductDocument, ReviewDocument, StoreSettingsDocument, UserDocument, WishlistDocument } from "./types"

export async function collection<T extends object>(name: string): Promise<Collection<T>> {
  return (await getDatabase()).collection<T>(name)
}

export const users = () => collection<UserDocument>("users")
export const products = () => collection<ProductDocument>("products")
export const categories = () => collection<CategoryDocument>("categories")
export const carts = () => collection<CartDocument>("carts")
export const wishlists = () => collection<WishlistDocument>("wishlists")
export const orders = () => collection<OrderDocument>("orders")
export const payments = () => collection<PaymentDocument>("payments")
export const coupons = () => collection<CouponDocument>("coupons")
export const reviews = () => collection<ReviewDocument>("reviews")
export const newsletters = () => collection<NewsletterDocument>("newsletters")
export const storeSettings = () => collection<StoreSettingsDocument>("store_settings")
