"use server";

import { db } from "@/lib/database";

type Props = {
  userId?: string;
  limit?: number;
  startDate?: string;
  endDate?: string;
};

/**
 * Get Checklist History
 *
 * Retrieves historical checklist data with filters
 * Useful for tracking completion rates over time
 *
 * @param userId - Optional user filter
 * @param limit - Number of records to retrieve (default: 50)
 * @param startDate - Optional start date filter (ISO string)
 * @param endDate - Optional end date filter (ISO string)
 */
export async function getChecklistHistory({
  userId,
  limit = 50,
  startDate,
  endDate,
}: Props = {}) {
  try {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const history = await db.getChecklistHistory(userId, start, end, limit);

    return {
      data: history.map((record) => ({
        id: record.id,
        userId: record.user_id,
        task: record.task,
        completed: record.completed,
        createdAt: record.created_at.toISOString(),
        createdBy: record.created_by,
      })),
    };
  } catch (error) {
    console.error("Error fetching checklist history:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch checklist history",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
