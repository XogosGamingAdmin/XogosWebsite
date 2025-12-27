"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";
import { ChecklistItem } from "@/types/dashboard";

/**
 * Get Checklists
 *
 * Retrieves checklist items for the current user
 */
export async function getChecklists() {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to view your checklist",
      },
    };
  }

  // Get user ID for filtering (TypeScript narrowing)
  const userId = session.user.info.id;

  try {
    // Fetch checklists from database
    const data = await db.getChecklistItems(userId);

    // Map database rows to ChecklistItem type
    const userChecklists: ChecklistItem[] = data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      task: item.task,
      completed: item.completed,
      createdAt: item.created_at,
      createdBy: item.created_by,
    }));

    return { data: userChecklists };
  } catch (error) {
    console.error("Error fetching checklists:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch checklist items",
        suggestion: "Please try again or contact support",
      },
    };
  }
}
