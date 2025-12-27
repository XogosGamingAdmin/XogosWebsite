"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/database";
import { ChecklistItem } from "@/types/dashboard";

type Props = {
  userId: string;
  task: string;
};

/**
 * Create Checklist Item
 *
 * Creates a new checklist item for a board member (admin only)
 *
 * @param userId - The board member's user ID (email)
 * @param task - The task description
 */
export async function createChecklistItem({ userId, task }: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to create checklist items",
      },
    };
  }

  // Check user is admin
  if (!isAdmin(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Admin access required",
        suggestion: "Only administrators can create checklist items",
      },
    };
  }

  try {
    // Insert into database
    const data = await db.createChecklistItem(userId, task, session.user.email);

    // Map database row to ChecklistItem type
    const newItem: ChecklistItem = {
      id: data.id,
      userId: data.user_id,
      task: data.task,
      completed: data.completed,
      createdAt: data.created_at,
      createdBy: data.created_by,
    };

    return { data: newItem };
  } catch (error) {
    console.error("Error creating checklist item:", error);
    return {
      error: {
        code: 500,
        message: "Failed to create checklist item",
        suggestion: "Please try again or contact support",
      },
    };
  }
}
