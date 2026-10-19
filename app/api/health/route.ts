import { NextResponse } from "next/server"
import { getDatabase } from "@/lib/db/client"

export async function GET() {
  try {
    await (await getDatabase()).command({ ping: 1 })
    return NextResponse.json({ success: true, data: { status: "ok", database: "connected" } })
  } catch {
    return NextResponse.json({ success: false, error: { code: "DATABASE_UNAVAILABLE", message: "Database is unavailable" } }, { status: 503 })
  }
}
