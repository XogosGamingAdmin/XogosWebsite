"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { supabase } from "@/lib/supabase";

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

  // Delete from Supabase
  const { error } = await supabase
    .from("checklist_items")
    .delete()
    .eq("id", itemId);

  if (error) {
    console.error("Error deleting checklist item:", error);
    return {
      error: {
        code: 500,
        message: "Failed to delete checklist item",
        suggestion: "Please try again or contact support",
      },
    };
  }

  return { data: { success: true } };
}
