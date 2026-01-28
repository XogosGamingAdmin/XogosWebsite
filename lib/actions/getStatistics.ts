"use server";

import { statsDb } from "@/lib/supabase";

/**
 * Get Statistics
 *
 * Retrieves the current Xogos statistics data from Supabase
 */
export async function getStatistics() {
  try {
    const stats = await statsDb.getStatistics();

    if (!stats) {
      return {
        error: {
          code: 404,
          message: "No statistics found",
          suggestion: "Initialize statistics in the database",
        },
      };
    }

    return {
      data: {
        accounts: stats.accounts,
        activeUsers: stats.active_users,
        totalHours: stats.total_hours,
        lastUpdated: stats.last_updated,
        updatedBy: stats.updated_by,
      },
    };
  } catch (error) {
    console.error("Error fetching statistics:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch statistics",
        suggestion: "Check Supabase connection and try again",
      },
    };
  }
}
