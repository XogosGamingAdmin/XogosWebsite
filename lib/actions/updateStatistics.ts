"use server";

import { auth } from "@/auth";
import { canUpdateStatistics } from "@/lib/auth/admin";
import { db } from "@/lib/database";

type Props = {
  accounts: number;
  activeUsers: number;
  totalHours: number;
};

/**
 * Update Statistics
 *
 * Updates the Xogos statistics (admin only)
 * Creates a new historical record in the database with timestamp
 *
 * @param data - The updated statistics values
 */
export async function updateStatistics({
  accounts,
  activeUsers,
  totalHours,
}: Props) {
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

  // Check user can update statistics (only Zack)
  if (!canUpdateStatistics(session.user.email)) {
    return {
      error: {
        code: 403,
        message: "Unauthorized",
        suggestion: "Only zack@xogosgaming.com can update statistics",
      },
    };
  }

  try {
    // Save to database - creates a new row with current timestamp
    const updatedStats = await db.updateStatistics(
      accounts,
      activeUsers,
      totalHours,
      session.user.email
    );

    return {
      data: {
        accounts: updatedStats.accounts,
        activeUsers: updatedStats.active_users,
        totalHours: updatedStats.total_hours,
        lastUpdated: updatedStats.last_updated.toISOString(),
        updatedBy: updatedStats.updated_by,
      },
    };
  } catch (error) {
    console.error("Error updating statistics:", error);
    return {
      error: {
        code: 500,
        message: "Failed to update statistics",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
