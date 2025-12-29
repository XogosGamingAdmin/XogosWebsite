"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/database";

type Props = {
  revenue: number;
  expenses: number;
  monthlyPayments: number;
  yearlyPayments: number;
  lifetimeMembers: number;
};

/**
 * Update Financials
 *
 * Updates the Xogos financials (admin only)
 * Creates a new historical record in the database with timestamp
 *
 * @param data - The updated financials values
 */
export async function updateFinancials({
  revenue,
  expenses,
  monthlyPayments,
  yearlyPayments,
  lifetimeMembers,
}: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to update financials",
      },
    };
  }

  // Check user is admin
  if (!isAdmin(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Admin access required",
        suggestion: "Only administrators can update financials",
      },
    };
  }

  try {
    // Save to database - creates a new row with current timestamp
    const updatedFinancials = await db.updateFinancials(
      revenue,
      expenses,
      monthlyPayments,
      yearlyPayments,
      lifetimeMembers,
      session.user.email
    );

    return {
      data: {
        revenue: Number(updatedFinancials.revenue),
        expenses: Number(updatedFinancials.expenses),
        monthlyPayments: Number(updatedFinancials.monthly_payments),
        yearlyPayments: Number(updatedFinancials.yearly_payments),
        lifetimeMembers: updatedFinancials.lifetime_members,
        lastUpdated: updatedFinancials.last_updated.toISOString(),
        updatedBy: updatedFinancials.updated_by,
      },
    };
  } catch (error) {
    console.error("Error updating financials:", error);
    return {
      error: {
        code: 500,
        message: "Failed to update financials",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
