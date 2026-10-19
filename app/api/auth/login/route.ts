import { NextResponse } from "next/server"
import { users } from "@/lib/db/collections"
import { createSessionToken, setSessionCookie, toPublicUser, verifyPassword } from "@/lib/auth"
import { loginSchema } from "@/lib/auth-schemas"

export async function POST(request: Request) {
  const parsed = loginSchema.safeParse(await request.json().catch(() => null))
  if (!parsed.success) return NextResponse.json({ success: false, error: { code: "VALIDATION_ERROR", message: "Invalid login details" } }, { status: 400 })
  const user = await (await users()).findOne({ email: parsed.data.email })
  if (!user?.passwordHash || !(await verifyPassword(parsed.data.password, user.passwordHash))) return NextResponse.json({ success: false, error: { code: "INVALID_CREDENTIALS", message: "Invalid email or password" } }, { status: 401 })
  const response = NextResponse.json({ success: true, data: { user: toPublicUser(user) } })
  response.cookies.set(setSessionCookie(createSessionToken(user)))
  return response
}
