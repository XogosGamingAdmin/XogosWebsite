"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";

interface ManageUserGroupParams {
  userId: string;
  groupId: string;
  action: "add" | "remove";
}

/**
 * Add or remove a user from a group (admin only)
 */
export async function manageUserGroup({
  userId,
  groupId,
  action,
}: ManageUserGroupParams): Promise<{
  success?: boolean;
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

    if (action === "add") {
      await db.addUserToGroup(userId, groupId);
    } else {
      await db.removeUserFromGroup(userId, groupId);
    }

    return { success: true };
  } catch (error) {
    console.error(`Error ${action}ing user to/from group:`, error);
    return { error: { message: `Failed to ${action} user to/from group` } };
  }
}
