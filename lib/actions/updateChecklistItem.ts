"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";
import { ChecklistItem } from "@/types/dashboard";

type Props = {
  itemId: string;
  completed: boolean;
};

/**
 * Update Checklist Item
 *
 * Toggles completion status of a checklist item (user's own items only)
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

  try {
    // First, fetch the item to verify ownership
    const item = await db.getChecklistItem(itemId);

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
    if (item.user_id !== session.user.info.id) {
      return {
        error: {
          code: 403,
          message: "Not allowed",
          suggestion: "You can only update your own checklist items",
        },
      };
    }

    // Update in database
    const data = await db.updateChecklistItem(itemId, completed);

    // Map database row to ChecklistItem type
    const updatedItem: ChecklistItem = {
      id: data.id,
      userId: data.user_id,
      task: data.task,
      completed: data.completed,
      createdAt: data.created_at,
      createdBy: data.created_by,
    };

    return { data: updatedItem };
  } catch (error) {
    console.error("Error updating checklist item:", error);
    return {
      error: {
        code: 500,
        message: "Failed to update checklist item",
        suggestion: "Please try again or contact support",
      },
    };
  }
}
