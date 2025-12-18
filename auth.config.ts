import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Simple Google-only authentication configuration
 *
 * Required environment variables:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";

// Validate credentials
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error(
    "\n" +
    "❌ ERROR: Google OAuth credentials are missing!\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "GOOGLE_CLIENT_ID: " + (GOOGLE_CLIENT_ID ? "✓ Set" : "✗ Missing") + "\n" +
    "GOOGLE_CLIENT_SECRET: " + (GOOGLE_CLIENT_SECRET ? "✓ Set" : "✗ Missing") + "\n" +
    "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n" +
    "Add these to AWS Amplify Environment Variables:\n" +
    "App Settings → Environment variables → Manage variables\n" +
    "Then redeploy the application.\n"
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "select_account",
        },
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/signin",
    error: "/signin", // Redirect errors back to sign-in page
  },
};
