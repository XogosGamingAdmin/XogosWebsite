import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Simple Google-only authentication configuration
 *
 * Required environment variables:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

// Get credentials from environment variables
// Note: In production, these MUST be set in AWS Amplify Environment Variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID!;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET!;

// Log warning if credentials appear to be missing (but don't crash the app)
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "⚠️ WARNING: Google OAuth credentials are not set!\n" +
    "Sign-in will not work until you set:\n" +
    "- GOOGLE_CLIENT_ID\n" +
    "- GOOGLE_CLIENT_SECRET\n" +
    "in AWS Amplify Environment Variables"
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
        },
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/signin",
    error: "/signin", // Redirect errors back to sign-in page
  },

  // Add these to ensure proper redirects
  basePath: "/api/auth",
  trustHost: true,
};
