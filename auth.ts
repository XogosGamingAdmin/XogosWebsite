import NextAuth from "next-auth";
import { authConfig } from "@/auth.config";
import { getUser } from "@/lib/database/getUser";

// Your NextAuth secret (generate a new one for production)
// More info: https://next-auth.js.org/configuration/options#secret
// `create-liveblocks-app` generates a value for you, but there's a
// fallback value in case you don't use the installer.
export const NEXTAUTH_SECRET =
  process.env.NEXTAUTH_SECRET || "p49RDzU36fidumaF7imGnzyhRSPWoffNjDOleU77SM4=";

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  secret: NEXTAUTH_SECRET,
  callbacks: {
    // Get extra user info from your database to pass to front-end
    // For front end, update next-auth.d.ts with session type
    async session({ session }: { session: any }) {
      const userInfo = await getUser(session.user.email);

      if (!userInfo) {
        console.warn(
          `⚠️ User ${session.user.email} not found in data/users.ts. Add them to grant board access.`
        );
        // Create a basic user object for users not in the database
        // They won't have access to board features but can still sign in
        session.user.info = {
          id: session.user.email,
          name: session.user.name || "Guest User",
          avatar:
            session.user.image || "https://liveblocks.io/avatars/avatar-0.png",
          color: "#000000",
          groupIds: [], // No group access until added to users.ts
        };
        return session;
      }

      session.user.info = userInfo;
      return session;
    },
  },
  pages: {
    signIn: "/signin",
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
