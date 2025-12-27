"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/database";
import { ChecklistItem } from "@/types/dashboard";

/**
 * Get All Checklists
 *
 * Retrieves all checklist items across all users (admin only)
 */
export async function getAllChecklists() {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to view checklists",
      },
    };
  }

  // Check user is admin
  if (!isAdmin(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Admin access required",
        suggestion: "Only administrators can view all checklists",
      },
    };
  }

  try {
    // Fetch all checklists from database
    const data = await db.getAllChecklistItems();

    // Map database rows to ChecklistItem type
    const allChecklists: ChecklistItem[] = data.map((item: any) => ({
      id: item.id,
      userId: item.user_id,
      task: item.task,
      completed: item.completed,
      createdAt: item.created_at,
      createdBy: item.created_by,
    }));

    return { data: allChecklists };
  } catch (error) {
    console.error("Error fetching all checklists:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch checklist items",
        suggestion: "Please try again or contact support",
      },
    };
  }
}
