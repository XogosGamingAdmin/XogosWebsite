"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/database";

type Props = {
  itemId: string;
};

/**
 * Delete Checklist Item
 *
 * Deletes a checklist item (admin only)
 *
 * @param itemId - The checklist item ID
 */
export async function deleteChecklistItem({ itemId }: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to delete checklist items",
      },
    };
  }

  // Check user is admin
  if (!isAdmin(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Admin access required",
        suggestion: "Only administrators can delete checklist items",
      },
    };
  }

  try {
    // Delete from database
    await db.deleteChecklistItem(itemId);
    return { data: { success: true } };
  } catch (error) {
    console.error("Error deleting checklist item:", error);
    return {
      error: {
        code: 500,
        message: "Failed to delete checklist item",
        suggestion: "Please try again or contact support",
      },
    };
  }
}
