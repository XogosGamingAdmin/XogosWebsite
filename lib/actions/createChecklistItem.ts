"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { ChecklistItem } from "@/types/dashboard";

type Props = {
  userId: string;
  task: string;
};

/**
 * Create Checklist Item
 *
 * Creates a new checklist item for a board member (admin only)
 * In a production environment, this would update a database
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

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism
  const newItem: ChecklistItem = {
    id: `checklist_${Date.now()}`,
    userId,
    task,
    completed: false,
    createdAt: new Date().toISOString(),
    createdBy: session.user.email,
  };

  return { data: newItem };
}
