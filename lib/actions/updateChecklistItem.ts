"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
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

  // First, fetch the item to verify ownership
  const { data: item, error: fetchError } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("id", itemId)
    .single();

  if (fetchError || !item) {
    console.error("Error fetching checklist item:", fetchError);
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

  // Update in Supabase
  const { data, error } = await supabase
    .from("checklist_items")
    .update({ completed })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Error updating checklist item:", error);
    return {
      error: {
        code: 500,
        message: "Failed to update checklist item",
        suggestion: "Please try again or contact support",
      },
    };
  }

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
}
