"use server";

import { statsDb } from "@/lib/supabase";

type Props = {
  limit?: number;
  startDate?: string;
  endDate?: string;
};

/**
 * Get Statistics History
 *
 * Retrieves historical Xogos statistics data from Supabase for trending/graphing
 * Each record represents a snapshot in time with timestamp
 *
 * @param limit - Number of records to retrieve (default: 30)
 * @param startDate - Optional start date filter (ISO string)
 * @param endDate - Optional end date filter (ISO string)
 */
export async function getStatisticsHistory({
  limit = 30,
  startDate,
  endDate,
}: Props = {}) {
  try {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const history = await statsDb.getStatisticsHistory(limit, start, end);

    return {
      data: history.map((record) => ({
        id: record.id,
        accounts: record.accounts,
        activeUsers: record.active_users,
        totalHours: record.total_hours,
        lastUpdated: record.last_updated,
        updatedBy: record.updated_by,
      })),
    };
  } catch (error) {
    console.error("Error fetching statistics history:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch statistics history",
        suggestion: "Check Supabase connection and try again",
      },
    };
  }
}
