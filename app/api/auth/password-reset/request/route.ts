import { NextResponse } from "next/server"
import { users } from "@/lib/db/collections"
import { createResetToken, hashResetToken } from "@/lib/auth"
import { resetRequestSchema } from "@/lib/auth-schemas"

export async function POST(request: Request) {
  const parsed = resetRequestSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "A valid email is required" } }, { status: 400 })
  const collection = await users()
  const user = await collection.findOne({ email: parsed.data.email })
  if (user) {
    const token = createResetToken()
    await collection.updateOne({ _id: user._id }, { $set: { resetTokenHash: hashResetToken(token), resetTokenExpiresAt: new Date(Date.now() + 15 * 60 * 1000), updatedAt: new Date() } })
    if (process.env.NODE_ENV !== "production") console.info("[v0] Password reset token generated for development", { email: user.email, token })
  }
  return NextResponse.json({ success: true, data: { message: "If an account exists, reset instructions have been sent" } })
}
