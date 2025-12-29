"use server";

import { db } from "@/lib/database";

/**
 * Get Financials
 *
 * Retrieves the current Xogos financials data from database
 */
export async function getFinancials() {
  try {
    const financials = await db.getFinancials();

    if (!financials) {
      return {
        error: {
          code: 404,
          message: "No financials found",
          suggestion: "Initialize financials in the database",
        },
      };
    }

    return {
      data: {
        revenue: Number(financials.revenue),
        expenses: Number(financials.expenses),
        monthlyPayments: Number(financials.monthly_payments),
        yearlyPayments: Number(financials.yearly_payments),
        lifetimeMembers: financials.lifetime_members,
        lastUpdated: financials.last_updated.toISOString(),
        updatedBy: financials.updated_by,
      },
    };
  } catch (error) {
    console.error("Error fetching financials:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch financials",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
