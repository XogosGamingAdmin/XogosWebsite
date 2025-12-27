"use server";

import { auth } from "@/auth";
import { checklists } from "@/data/checklists";

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

  // Filter checklists for current user
  const userChecklists = checklists.filter(
    (item) => item.userId === userId
  );

  return { data: userChecklists };
}
