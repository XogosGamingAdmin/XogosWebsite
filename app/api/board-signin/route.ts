import { NextRequest, NextResponse } from "next/server";

export async function GET(_request: NextRequest) {
  // Build the NextAuth sign-in URL with Google provider
  // This properly handles state management and callback URLs
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.histronics.com";
  const signInUrl = new URL(`${baseUrl}/api/auth/signin/google`);

  // Add callback URL to redirect to board after successful sign-in
  signInUrl.searchParams.set("callbackUrl", `${baseUrl}/board`);

  // Redirect to NextAuth's Google sign-in endpoint
  // This ensures proper state management and CSRF protection
  return NextResponse.redirect(signInUrl.toString());
}
