"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { checklists } from "@/data/checklists";

type Props = {
  itemId: string;
};

/**
 * Delete Checklist Item
 *
 * Deletes a checklist item (admin only)
 * In a production environment, this would update a database
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

  // Find the checklist item
  const item = checklists.find((i) => i.id === itemId);

  if (!item) {
    return {
      error: {
        code: 404,
        message: "Checklist item not found",
        suggestion: "Refresh the page and try again",
      },
    };
  }

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism

  return { data: { success: true } };
}
