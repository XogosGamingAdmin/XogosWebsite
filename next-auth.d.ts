import { User } from "./types";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      name?: string | null;
      email?: string | null;
      image?: string | null;
      // The type of extra info taken from your database and sent to front end from auth endpoint
      info?: User;
    };
  }
}
