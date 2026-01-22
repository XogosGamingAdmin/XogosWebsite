import { groups } from "@/data/groups";
import { Group } from "@/types";

/**
 * Get Group
 *
 * Fetches group from database, with fallback to static data
 *
 * @param id - The group's id
 */
export async function getGroup(id: string): Promise<Group | null> {
  // Try to get group from database first (server-side only)
  if (typeof window === "undefined") {
    try {
      // Dynamic import to avoid bundling pg for client
      const { db } = await import("@/lib/database");
      const dbGroup = await db.getGroupById(id);
      if (dbGroup) {
        return {
          id: dbGroup.id,
          name: dbGroup.name,
        };
      }
    } catch (error) {
      // Database not available, fall back to static data
      console.warn("Database not available, using static group data");
    }
  }

  // Fallback to static data
  return groups.find((group) => group.id === id) ?? null;
}
