import { NextResponse } from "next/server"
import { users } from "@/lib/db/collections"
import { hashPassword, hashResetToken } from "@/lib/auth"
import { resetCompleteSchema } from "@/lib/auth-schemas"

export async function POST(request: Request) {
  const parsed = resetCompleteSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid reset details" } }, { status: 400 })
  const user = await (await users()).findOne({ resetTokenHash: hashResetToken(parsed.data.token), resetTokenExpiresAt: { $gt: new Date() } })
  if (!user) return NextResponse.json({ success: false, error: { code: "INVALID_RESET_TOKEN", message: "Reset token is invalid or expired" } }, { status: 400 })
  await (await users()).updateOne({ _id: user._id }, { $set: { passwordHash: await hashPassword(parsed.data.password), updatedAt: new Date() }, $unset: { resetTokenHash: "", resetTokenExpiresAt: "" } })
  return NextResponse.json({ success: true, data: { message: "Password updated successfully" } })
}
