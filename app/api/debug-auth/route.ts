import { NextResponse } from "next/server";

/**
 * TEMPORARY DEBUG ENDPOINT - DELETE AFTER FIXING AUTH
 * Shows full OAuth credentials to verify configuration
 */
export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";
  const nextAuthUrl = process.env.NEXTAUTH_URL || "";

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    debug: {
      GOOGLE_CLIENT_ID: clientId,
      GOOGLE_CLIENT_ID_LENGTH: clientId.length,
      GOOGLE_CLIENT_SECRET: clientSecret,
      GOOGLE_CLIENT_SECRET_LENGTH: clientSecret.length,
      NEXTAUTH_URL: nextAuthUrl,
      EXPECTED_CALLBACK_URL: `${nextAuthUrl}/api/auth/callback/google`,
    },
    warning: "⚠️ DELETE THIS ENDPOINT AFTER DEBUGGING - IT EXPOSES SECRETS!",
  });
}
