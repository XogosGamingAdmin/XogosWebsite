"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";

interface UserWithGroups {
  id: string;
  name: string;
  avatar: string | null;
  groupIds: string[];
}

/**
 * Get all users with their group memberships (admin only)
 */
export async function getUsersWithGroups(): Promise<{
  data?: UserWithGroups[];
  error?: { message: string };
}> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: { message: "Not authenticated" } };
  }

  if (!isAdmin(session.user.email)) {
    return { error: { message: "Not authorized" } };
  }

  try {
    const { db } = await import("@/lib/database");
    const users = await db.getAllUsers();

    return {
      data: users.map((user) => ({
        id: user.id,
        name: user.name,
        avatar: user.avatar,
        groupIds: user.group_ids || [],
      })),
    };
  } catch (error) {
    console.error("Error fetching users with groups:", error);
    return { error: { message: "Failed to fetch users" } };
  }
}
