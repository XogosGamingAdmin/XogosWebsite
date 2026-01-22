"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { DOCUMENT_GROUPS } from "@/constants";

interface DocumentGroup {
  id: string;
  name: string;
}

/**
 * Get all document groups (for admin group management)
 */
export async function getAdminDocumentGroups(): Promise<{
  data?: DocumentGroup[];
  error?: { message: string };
}> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: { message: "Not authenticated" } };
  }

  if (!isAdmin(session.user.email)) {
    return { error: { message: "Not authorized" } };
  }

  try {
    // First try to get from database
    const { db } = await import("@/lib/database");
    const dbGroups = await db.getGroupsByIds(
      DOCUMENT_GROUPS.map((g) => g.id)
    );

    if (dbGroups && dbGroups.length > 0) {
      return {
        data: dbGroups.map((g) => ({ id: g.id, name: g.name })),
      };
    }

    // Fallback to constant groups
    return { data: DOCUMENT_GROUPS };
  } catch (error) {
    console.error("Error fetching document groups:", error);
    // Fallback to constant groups
    return { data: DOCUMENT_GROUPS };
  }
}
