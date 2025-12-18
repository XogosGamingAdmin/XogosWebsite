import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { getUser } from "@/lib/database/getUser";
import { isAuthorizedEmail } from "@/lib/auth/authorized-emails";

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
  callbacks: {
    /**
     * Check if user is authorized during sign-in
     * Only allow users on the whitelist
     */
    async signIn({ user, account, profile }) {
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
    },

    /**
     * Add user info to session
     */
    async session({ session }) {
      if (!session.user?.email) {
        return session;
      }

      // Get user data from the database
      const userInfo = await getUser(session.user.email);

      if (userInfo) {
        session.user.info = userInfo;
      } else {
        // Create basic user object for authorized users not in database
        session.user.info = {
          id: session.user.email,
          name: session.user.name || "Board Member",
          avatar:
            session.user.image || "https://liveblocks.io/avatars/avatar-0.png",
          color: "#4F46E5",
          groupIds: [],
        };
      }

      return session;
    },
  },

  ...authConfig,
});

export function getProviders() {
  const providers: Record<string, string> = {};

  for (const provider of authConfig.providers) {
    if ("id" in provider) {
      providers[provider.id] = provider.name;
    }
  }

  return providers;
}
