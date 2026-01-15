import { users } from "@/data/users";
import { Document, User } from "@/types";
import { getUser, getRandom } from "./getUser";
import { colors } from "@/data/colors";

type Props = {
  userIds?: Document["id"][];
  search?: string;
};

/**
 * Get Users
 *
 * Fetches users from database, with fallback to static data
 *
 * @param userIds - The user's ids to get
 * @param searchTerm - The term to filter your users by, checks users' ids and names
 */
export async function getUsers({ userIds, search }: Props) {
  // If specific userIds provided, get them individually
  if (userIds) {
    const usersPromises: Promise<User | null>[] = [];
    for (const userId of userIds) {
      usersPromises.push(getUser(userId));
    }
    const userList = await Promise.all(usersPromises);

    if (search) {
      const term = search.toLowerCase();
      return userList.filter((user) => {
        if (!user) return false;
        return (
          user.name.toLowerCase().includes(term) ||
          user.id.toLowerCase().includes(term)
        );
      });
    }

    return userList;
  }

  // Get all users - try database first (server-side only)
  if (typeof window === "undefined") {
    try {
      // Dynamic import to avoid bundling pg for client
      const { db } = await import("@/lib/database");
      const dbUsers = await db.getAllUsers();
      if (dbUsers && dbUsers.length > 0) {
        let userList = dbUsers.map((dbUser) => ({
          id: dbUser.id,
          name: dbUser.name,
          avatar: dbUser.avatar,
          groupIds: dbUser.group_ids || [],
          color: getRandom(colors, dbUser.id),
        }));

        if (search) {
          const term = search.toLowerCase();
          userList = userList.filter(
            (user) =>
              user.name.toLowerCase().includes(term) ||
              user.id.toLowerCase().includes(term)
          );
        }

        return userList;
      }
    } catch (error) {
      console.warn("Database not available, using static user data");
    }
  }

  // Fallback to static data
  const usersPromises: Promise<User | null>[] = [];
  const allUserIds = users.map((user) => user.id);
  for (const userId of allUserIds) {
    usersPromises.push(getUser(userId));
  }

  const userList = await Promise.all(usersPromises);

  if (search) {
    const term = search.toLowerCase();
    return userList.filter((user) => {
      if (!user) return false;
      return (
        user.name.toLowerCase().includes(term) ||
        user.id.toLowerCase().includes(term)
      );
    });
  }

  return userList;
}
