"use server";

import { db } from "@/lib/database";

type Props = {
  limit?: number;
  startDate?: string;
  endDate?: string;
};

/**
 * Get Financials History
 *
 * Retrieves historical Xogos financials data for trending/graphing
 * Each record represents a snapshot in time with timestamp
 *
 * @param limit - Number of records to retrieve (default: 30)
 * @param startDate - Optional start date filter (ISO string)
 * @param endDate - Optional end date filter (ISO string)
 */
export async function getFinancialsHistory({
  limit = 30,
  startDate,
  endDate,
}: Props = {}) {
  try {
    const start = startDate ? new Date(startDate) : undefined;
    const end = endDate ? new Date(endDate) : undefined;

    const history = await db.getFinancialsHistory(limit, start, end);

    return {
      data: history.map((record) => ({
        id: record.id,
        revenue: Number(record.revenue),
        expenses: Number(record.expenses),
        monthlyPayments: Number(record.monthly_payments),
        yearlyPayments: Number(record.yearly_payments),
        lifetimeMembers: record.lifetime_members,
        lastUpdated: record.last_updated.toISOString(),
        updatedBy: record.updated_by,
      })),
    };
  } catch (error) {
    console.error("Error fetching financials history:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch financials history",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
