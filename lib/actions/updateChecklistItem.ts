"use server";

import { auth } from "@/auth";
import { checklists } from "@/data/checklists";

type Props = {
  itemId: string;
  completed: boolean;
};

/**
 * Update Checklist Item
 *
 * Toggles completion status of a checklist item (user's own items only)
 * In a production environment, this would update a database
 *
 * @param itemId - The checklist item ID
 * @param completed - The new completion status
 */
export async function updateChecklistItem({ itemId, completed }: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to update checklist items",
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

  // Check user owns this checklist item
  if (item.userId !== session.user.info.id) {
    return {
      error: {
        code: 403,
        message: "Not allowed",
        suggestion: "You can only update your own checklist items",
      },
    };
  }

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism
  const updatedItem = { ...item, completed };

  return { data: updatedItem };
}
