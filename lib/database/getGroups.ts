import { groups } from "@/data/groups";
import { Group } from "@/types";

/**
 * Get Groups
 *
 * Fetches groups from database, with fallback to static data
 *
 * @param ids - The group ids
 */
export async function getGroups(ids: string[]): Promise<Group[]> {
  if (ids.length === 0) return [];

  // Try to get groups from database first (server-side only)
  if (typeof window === "undefined") {
    try {
      // Dynamic import to avoid bundling pg for client
      const { db } = await import("@/lib/database");
      const dbGroups = await db.getGroupsByIds(ids);
      if (dbGroups && dbGroups.length > 0) {
        return dbGroups.map((g) => ({
          id: g.id,
          name: g.name,
        }));
      }
    } catch (error) {
      // Database not available, fall back to static data
      console.warn("Database not available, using static group data");
    }
  }

  // Fallback to static data
  return groups.filter((group) => ids.includes(group.id));
}

/**
 * Get All Groups
 *
 * Fetches all groups from database, with fallback to static data
 */
export async function getAllGroups(): Promise<Group[]> {
  // Try to get groups from database first (server-side only)
  if (typeof window === "undefined") {
    try {
      // Dynamic import to avoid bundling pg for client
      const { db } = await import("@/lib/database");
      const dbGroups = await db.getAllGroups();
      if (dbGroups && dbGroups.length > 0) {
        return dbGroups.map((g) => ({
          id: g.id,
          name: g.name,
        }));
      }
    } catch (error) {
      // Database not available, fall back to static data
      console.warn("Database not available, using static group data");
    }
  }

  // Fallback to static data
  return groups;
}
