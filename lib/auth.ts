import { createHash, randomBytes } from "node:crypto"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import type { NextRequest } from "next/server"
import { users } from "@/lib/db/collections"
import type { UserDocument, UserRole } from "@/lib/db/types"

const SESSION_COOKIE = "you-store-session"
const JWT_SECRET: string = process.env.AUTH_SECRET ?? "development-only-change-this-secret"
if (process.env.NODE_ENV === "production" && JWT_SECRET === "development-only-change-this-secret") throw new Error("AUTH_SECRET is not configured")

export interface SessionPayload { userId: string; role: UserRole; email: string }
export interface PublicUser { id: string; email: string; name: string; role: UserRole; isEmailVerified: boolean }

export function toPublicUser(user: UserDocument): PublicUser {
  return { id: user._id!.toHexString(), email: user.email, name: user.name, role: user.role, isEmailVerified: user.isEmailVerified }
}

export async function hashPassword(password: string) { return bcrypt.hash(password, 12) }
export async function verifyPassword(password: string, hash: string) { return bcrypt.compare(password, hash) }
export function createSessionToken(user: UserDocument) { return jwt.sign({ userId: user._id!.toHexString(), role: user.role, email: user.email }, JWT_SECRET, { expiresIn: "7d" }) }
export function setSessionCookie(token: string) { return { name: SESSION_COOKIE, value: token, httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 60 * 60 * 24 * 7 } }
export function clearSessionCookie() { return { name: SESSION_COOKIE, value: "", httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax" as const, path: "/", maxAge: 0 } }

export function getSessionFromRequest(request: NextRequest): SessionPayload | null {
  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!token) return null
  try { return jwt.verify(token, JWT_SECRET) as SessionPayload } catch { return null }
}

export async function getUserById(userId: string) {
  const { ObjectId } = await import("mongodb")
  if (!ObjectId.isValid(userId)) return null
  return (await users()).findOne({ _id: new ObjectId(userId) })
}

export function createResetToken() { return randomBytes(32).toString("hex") }
export function hashResetToken(token: string) { return createHash("sha256").update(token).digest("hex") }
