import { z } from "zod"

const imageSchema = z.object({ url: z.string().url(), publicId: z.string().min(1), alt: z.string().max(200).optional() })
const variantSchema = z.object({ name: z.string().trim().min(1).max(100), options: z.array(z.string().trim().min(1).max(100)).min(1).max(50) })

export const categoryInputSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(1000).optional(),
  imageUrl: z.string().url().optional(),
  isActive: z.boolean().optional(),
})

export const productInputSchema = z.object({
  slug: z.string().trim().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(10000),
  categoryId: z.string().regex(/^[a-f\\d]{24}$/i),
  price: z.number().finite().nonnegative(),
  compareAtPrice: z.number().finite().positive().optional(),
  stock: z.number().int().nonnegative(),
  status: z.enum(["draft", "active", "archived"]).default("draft"),
  images: z.array(imageSchema).max(20).default([]),
  variants: z.array(variantSchema).max(20).default([]),
  specifications: z.record(z.string(), z.string().max(500)).default({}),
}).refine((value) => value.compareAtPrice === undefined || value.compareAtPrice >= value.price, { path: ["compareAtPrice"], message: "Compare-at price must be greater than or equal to price" })
