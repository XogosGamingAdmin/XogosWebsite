import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Simple Google-only authentication configuration
 *
 * Required environment variables:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

// Validate Google credentials are present
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET) {
  console.error(
    "❌ MISSING CREDENTIALS: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET must be set in environment variables.\n" +
    "Add these to AWS Amplify Environment Variables or your .env.local file.\n" +
    "Authentication will not work until these are configured."
  );
}

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
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
