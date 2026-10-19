import { NextResponse } from "next/server"
import { users } from "@/lib/db/collections"
import { hashPassword, createSessionToken, setSessionCookie, toPublicUser } from "@/lib/auth"
import { registerSchema } from "@/lib/auth-schemas"

export async function POST(request: Request) {
  const parsed = registerSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid registration details" } }, { status: 400 })
  const collection = await users()
  if (await collection.findOne({ email: parsed.data.email })) return NextResponse.json({ success: false, error: { code: "EMAIL_EXISTS", message: "An account with this email already exists" } }, { status: 409 })
  const now = new Date()
  const user = { email: parsed.data.email, name: parsed.data.name, passwordHash: await hashPassword(parsed.data.password), role: "customer" as const, isEmailVerified: false, createdAt: now, updatedAt: now }
  const result = await collection.insertOne(user)
  const created = { ...user, _id: result.insertedId }
  const response = NextResponse.json({ success: true, data: { user: toPublicUser(created) } }, { status: 201 })
  response.cookies.set(setSessionCookie(createSessionToken(created)))
  return response
}
