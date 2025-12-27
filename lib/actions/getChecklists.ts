"use server";

import { auth } from "@/auth";
import { supabase } from "@/lib/supabase";
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

  // Fetch checklists from Supabase
  const { data, error } = await supabase
    .from("checklist_items")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching checklists:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch checklist items",
        suggestion: "Please try again or contact support",
      },
    };
  }

  // Map database rows to ChecklistItem type
  const userChecklists: ChecklistItem[] = (data || []).map((item) => ({
    id: item.id,
    userId: item.user_id,
    task: item.task,
    completed: item.completed,
    createdAt: item.created_at,
    createdBy: item.created_by,
  }));

  return { data: userChecklists };
}
