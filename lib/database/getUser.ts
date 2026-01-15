import { colors } from "@/data/colors";
import { users } from "@/data/users";
import { db } from "@/lib/database";

/**
 * Get User
 *
 * Fetches user from database, with fallback to static data
 *
 * @param userId - The user's id (email)
 */
export async function getUser(userId: string) {
  // Try to get user from database first
  try {
    const dbUser = await db.getUserById(userId);
    if (dbUser) {
      const color = getRandom(colors, userId);
      return {
        id: dbUser.id,
        name: dbUser.name,
        avatar: dbUser.avatar,
        groupIds: dbUser.group_ids || [],
        color,
      };
    }
  } catch (error) {
    // Database not available, fall back to static data
    console.warn("Database not available, using static user data");
  }

  // Fallback to static data
  const user = users.find((user) => user.id === userId);

  if (!user) {
    console.warn(`
ERROR: User "${userId}" was not found in database or static data.

Check that you've added the user to the database or data/users.ts, for example:
{
  id: "${userId}",
  name: "Tchoka Ahoki",
  avatar: "https://liveblocks.io/avatars/avatar-7.png",
  groupIds: ["product", "engineering", "design"],
},

`);
    return null;
  }

  const color = getRandom(colors, userId);
  return { color, ...user };
}

export function getRandom<T>(array: T[], seed?: string): T {
  const index = seed
    ? Math.abs(hashCode(seed)) % array.length
    : Math.floor(Math.random() * array.length);

  return array[index];
}

function hashCode(string: string) {
  let hash = 0;

  if (string.length > 0) {
    let index = 0;

    while (index < string.length) {
      hash = ((hash << 5) - hash + string.charCodeAt(index++)) | 0;
    }
  }

  return hash;
}
