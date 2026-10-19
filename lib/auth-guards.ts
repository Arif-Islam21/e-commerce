import { NextRequest } from "next/server"
import { getSessionFromRequest, getUserById } from "@/lib/auth"
import type { UserDocument } from "@/lib/db/types"

export async function requireUser(request: NextRequest): Promise<UserDocument> {
  const session = getSessionFromRequest(request)
  if (!session) throw new Error("UNAUTHENTICATED")
  const user = await getUserById(session.userId)
  if (!user) throw new Error("UNAUTHENTICATED")
  return user
}

export async function requireAdmin(request: NextRequest): Promise<UserDocument> {
  const user = await requireUser(request)
  if (user.role !== "admin") throw new Error("FORBIDDEN")
  return user
}
