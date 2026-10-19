import { NextRequest, NextResponse } from "next/server"
import { getSessionFromRequest } from "@/lib/auth"

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname
  if (!path.startsWith("/api/admin")) return NextResponse.next()
  const session = getSessionFromRequest(request)
  if (!session) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, { status: 401 })
  if (session.role !== "admin") return NextResponse.json({ success: false, error: { code: "FORBIDDEN", message: "Admin access required" } }, { status: 403 })
  return NextResponse.next()
}

export const config = { matcher: ["/api/admin/:path*"] }
