"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { XogosFinancials } from "@/types/dashboard";

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
 * In a production environment, this would update a database
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

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism
  const updatedFinancials: XogosFinancials = {
    revenue,
    expenses,
    monthlyPayments,
    yearlyPayments,
    lifetimeMembers,
    lastUpdated: new Date().toISOString(),
    updatedBy: session.user.email,
  };

  return { data: updatedFinancials };
}
