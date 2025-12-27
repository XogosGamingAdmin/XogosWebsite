"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { XogosStatistics } from "@/types/dashboard";

type Props = {
  accounts: number;
  activeUsers: number;
  totalHours: number;
};

/**
 * Update Statistics
 *
 * Updates the Xogos statistics (admin only)
 * In a production environment, this would update a database
 *
 * @param data - The updated statistics values
 */
export async function updateStatistics({ accounts, activeUsers, totalHours }: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to update statistics",
      },
    };
  }

  // Check user is admin
  if (!isAdmin(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Admin access required",
        suggestion: "Only administrators can update statistics",
      },
    };
  }

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism
  const updatedStatistics: XogosStatistics = {
    accounts,
    activeUsers,
    totalHours,
    lastUpdated: new Date().toISOString(),
    updatedBy: session.user.email,
  };

  return { data: updatedStatistics };
}
