import { NextResponse } from "next/server";

export async function GET() {
  // Read Client ID from environment variable
  const clientId = process.env.GOOGLE_CLIENT_ID;
  const redirectUri = "https://www.histronics.com/api/auth/callback/google";

  if (!clientId) {
    return NextResponse.json(
      {
        error: "Configuration Error",
        message: "GOOGLE_CLIENT_ID is not set in environment variables.",
      },
      { status: 500 }
    );
  }

  // Construct Google OAuth URL
  const googleAuthUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  googleAuthUrl.searchParams.set("client_id", clientId);
  googleAuthUrl.searchParams.set("redirect_uri", redirectUri);
  googleAuthUrl.searchParams.set("response_type", "code");
  googleAuthUrl.searchParams.set("scope", "openid email profile");
  googleAuthUrl.searchParams.set("prompt", "select_account");

  // Redirect to Google
  return NextResponse.redirect(googleAuthUrl.toString());
}
