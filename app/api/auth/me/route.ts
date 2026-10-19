import { NextResponse } from "next/server"
import { getUserById, toPublicUser } from "@/lib/auth"
import { getSessionFromRequest } from "@/lib/auth"
import { NextRequest } from "next/server"
export async function GET(request: NextRequest) { const session = getSessionFromRequest(request); if (!session) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, { status: 401 }); const user = await getUserById(session.userId); if (!user) return NextResponse.json({ success: false, error: { code: "UNAUTHENTICATED", message: "Authentication required" } }, { status: 401 }); return NextResponse.json({ success: true, data: { user: toPublicUser(user) } }) }
