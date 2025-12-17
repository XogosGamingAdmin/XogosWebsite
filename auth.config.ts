import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import Auth0Provider from "next-auth/providers/auth0";

// Build providers array conditionally based on available environment variables
const providers = [];

// Add Google provider if credentials are available
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  providers.push(
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    })
  );
} else {
  console.warn(
    "⚠️ Google OAuth credentials not found. Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET to enable Google sign-in."
  );
}

// Add Auth0 provider if credentials are available
if (
  process.env.AUTH0_CLIENT_ID &&
  process.env.AUTH0_CLIENT_SECRET &&
  process.env.AUTH0_ISSUER
) {
  providers.push(
    Auth0Provider({
      clientId: process.env.AUTH0_CLIENT_ID,
      clientSecret: process.env.AUTH0_CLIENT_SECRET,
      issuer: process.env.AUTH0_ISSUER,
    })
  );
} else {
  console.warn(
    "⚠️ Auth0 credentials not found. Set AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, and AUTH0_ISSUER to enable Auth0 sign-in."
  );
}

// Ensure we have at least one provider
if (providers.length === 0) {
  console.error(
    "❌ ERROR: No authentication providers configured! " +
      "You must set environment variables for at least one provider:\n" +
      "  - Google: GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\n" +
      "  - Auth0: AUTH0_CLIENT_ID, AUTH0_CLIENT_SECRET, and AUTH0_ISSUER\n" +
      "Authentication will not work until these are set."
  );
  // Don't throw - let the app run without auth rather than crash completely
}

export const authConfig: NextAuthConfig = {
  // Configure one or more authentication providers
  // More info: https://next-auth.js.org/providers/
  providers,

  /*
    // Use GitHub authentication
    // import GithubProvider from "next-auth/providers/github";
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
    }),
    */

  // ...add more providers here
};
