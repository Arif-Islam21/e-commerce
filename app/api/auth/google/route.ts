import { NextResponse } from "next/server"

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID
  const appUrl = process.env.APP_URL
  if (!clientId || !appUrl) return NextResponse.json({ success: false, error: { code: "GOOGLE_AUTH_NOT_CONFIGURED", message: "Google sign-in is not configured" } }, { status: 503 })
  const redirectUri = `${appUrl.replace(/\/$/, "")}/api/auth/google/callback`
  const params = new URLSearchParams({ client_id: clientId, redirect_uri: redirectUri, response_type: "code", scope: "openid email profile", access_type: "offline", prompt: "select_account" })
  return NextResponse.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`)
}
