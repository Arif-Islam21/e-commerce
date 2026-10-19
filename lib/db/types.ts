import type { ObjectId } from "mongodb"

export type UserRole = "customer" | "admin"
export type ProductStatus = "draft" | "active" | "archived"
export type OrderStatus = "pending" | "confirmed" | "processing" | "shipped" | "delivered" | "cancelled" | "returned"

export interface UserDocument {
  _id?: ObjectId
  email: string
  name: string
  passwordHash?: string
  role: UserRole
  isEmailVerified: boolean
  createdAt: Date
  updatedAt: Date
  resetTokenHash?: string
  resetTokenExpiresAt?: Date
}

export interface ProductDocument {
  _id?: ObjectId
  slug: string
  name: string
  description: string
  categoryId: ObjectId
  price: number
  compareAtPrice?: number
  stock: number
  status: ProductStatus
  images: Array<{ url: string; publicId: string; alt?: string }>
  variants: Array<{ name: string; options: string[] }>
  specifications: Record<string, string>
  createdAt: Date
  updatedAt: Date
}

export interface CategoryDocument {
  _id?: ObjectId
  slug: string
  name: string
  description?: string
  imageUrl?: string
  isActive: boolean
  createdAt: Date
  updatedAt: Date
}

export interface CartItem { productId: ObjectId; quantity: number; variant?: Record<string, string> }
export interface CartDocument { _id?: ObjectId; userId?: ObjectId; guestId?: string; items: CartItem[]; createdAt: Date; updatedAt: Date }
export interface WishlistDocument { _id?: ObjectId; userId: ObjectId; productIds: ObjectId[]; createdAt: Date; updatedAt: Date }
export interface OrderDocument { _id?: ObjectId; userId: ObjectId; items: Array<{ productId: ObjectId; name: string; quantity: number; unitPrice: number; variant?: Record<string, string> }>; subtotal: number; shippingFee: number; discount: number; total: number; currency: "BDT"; status: OrderStatus; createdAt: Date; updatedAt: Date }
export interface PaymentDocument { _id?: ObjectId; orderId: ObjectId; provider: string; status: "pending" | "paid" | "failed" | "refunded"; amount: number; transactionId?: string; createdAt: Date; updatedAt: Date }
export interface CouponDocument { _id?: ObjectId; code: string; type: "percentage" | "fixed"; value: number; minimumOrderValue?: number; expiresAt?: Date; usageLimit?: number; usedCount: number; isActive: boolean; createdAt: Date; updatedAt: Date }
export interface ReviewDocument { _id?: ObjectId; productId: ObjectId; userId: ObjectId; rating: number; title?: string; body: string; status: "pending" | "approved" | "rejected"; createdAt: Date; updatedAt: Date }
export interface NewsletterDocument { _id?: ObjectId; email: string; isSubscribed: boolean; createdAt: Date; updatedAt: Date }
export interface StoreSettingsDocument { _id?: ObjectId; key: string; value: unknown; updatedAt: Date }
