import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

/**
 * Simple Google-only authentication configuration
 *
 * Required environment variables:
 * - GOOGLE_CLIENT_ID
 * - GOOGLE_CLIENT_SECRET
 */

export const authConfig: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/signin",
    error: "/signin", // Redirect errors back to sign-in page
  },
};
