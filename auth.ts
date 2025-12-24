import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { getUser } from "@/lib/database/getUser";
import { isAuthorizedEmail } from "@/lib/auth/authorized-emails";

// Read environment variables FIRST
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const NEXTAUTH_URL = process.env.NEXTAUTH_URL || "https://www.histronics.com";

// Log for debugging
console.log("🔧 Auth initialization:");
console.log("  GOOGLE_CLIENT_ID:", GOOGLE_CLIENT_ID ? `${GOOGLE_CLIENT_ID.substring(0, 10)}...` : "❌ MISSING");
console.log("  GOOGLE_CLIENT_SECRET:", GOOGLE_CLIENT_SECRET ? "✓ Set" : "❌ MISSING");
console.log("  NEXTAUTH_URL:", NEXTAUTH_URL);
console.log("  Expected callback:", `${NEXTAUTH_URL}/api/auth/callback/google`);

// Validate credentials
if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
  console.error("❌ CRITICAL: Missing Google OAuth credentials!");
  console.error("  Set GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in AWS Amplify Environment Variables");
}

export const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "p49RDzU36fidumaF7imGnzyhRSPWoffNjDOleU77SM4=";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: NEXTAUTH_SECRET,
  debug: true, // Enable debug logging

  // Configure providers directly here with runtime env vars
  providers: [
    GoogleProvider({
      clientId: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          redirect_uri: `${NEXTAUTH_URL}/api/auth/callback/google`,
        },
      },
    }),
  ],

  // Custom pages
  pages: {
    signIn: "/signin",
    error: "/signin",
  },

  // Essential for AWS Amplify
  basePath: "/api/auth",
  trustHost: true,

  callbacks: {
    /**
     * Check if user is authorized during sign-in
     * Only allow users on the whitelist
     */
    async signIn({ user, account, profile }) {
      try {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("🔐 Sign-in callback triggered");
        console.log("User:", JSON.stringify(user, null, 2));
        console.log("Account:", JSON.stringify(account, null, 2));
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");

        const email = user.email;

        // Check if email is on the authorized list
        if (!isAuthorizedEmail(email)) {
          console.warn(
            `❌ Unauthorized sign-in attempt by ${email}. Not on whitelist.`
          );
          return false; // Deny access
        }

        console.log(`✅ Authorized sign-in: ${email}`);
        return true; // Allow access
      } catch (error) {
        console.error("❌ ERROR in signIn callback:", error);
        console.error("Stack:", error instanceof Error ? error.stack : "N/A");
        return false;
      }
    },

    /**
     * Add user info to session
     */
    async session({ session }) {
      try {
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        console.log("📝 Session callback triggered");
        console.log("Session user:", session.user?.email);

        if (!session.user?.email) {
          console.log("⚠️ No email in session, returning as-is");
          return session;
        }

        // Get user data from the database
        console.log("Fetching user from database...");
        const userInfo = await getUser(session.user.email);

        if (userInfo) {
          console.log("✅ User found in database");
          session.user.info = userInfo;
        } else {
          console.log("⚠️ User not in database, using fallback info");
          // Create basic user object for authorized users not in database
          session.user.info = {
            id: session.user.email,
            name: session.user.name || "Board Member",
            avatar:
              session.user.image ||
              "https://liveblocks.io/avatars/avatar-0.png",
            color: "#4F46E5",
            groupIds: [],
          };
        }

        console.log("✅ Session callback complete");
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
        return session;
      } catch (error) {
        console.error("❌ ERROR in session callback:", error);
        console.error("Stack:", error instanceof Error ? error.stack : "N/A");

        // Provide fallback user info to prevent total failure
        if (session.user?.email) {
          console.log("⚠️ Using emergency fallback user info");
          session.user.info = {
            id: session.user.email,
            name: session.user.name || "Board Member",
            avatar:
              session.user.image ||
              "https://liveblocks.io/avatars/avatar-0.png",
            color: "#4F46E5",
            groupIds: [],
          };
        }

        return session;
      }
    },
  },
});
