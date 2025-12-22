import { NextResponse } from "next/server";

export async function GET() {
  // Get environment variables
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.histronics.com";

  if (!clientId) {
    return NextResponse.json(
      {
        error: "Configuration Error",
        message: "GOOGLE_CLIENT_ID is not set in environment variables.",
      },
      { status: 500 }
    );
  }

  // Build the state parameter with callback URL
  const state = Buffer.from(
    JSON.stringify({ callbackUrl: `${baseUrl}/dashboard` })
  ).toString("base64");

  // Construct Google OAuth URL with NextAuth callback
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set(
    "redirect_uri",
    `${baseUrl}/api/auth/callback/google`
  );
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");
  googleAuthUrl.searchParams.set("state", state);

  // Redirect to Google
  return NextResponse.redirect(googleAuthUrl.toString());
}
