/**
 * Financial dashboard authorization utilities
 *
 * Determines who has access to the financial dashboard based on
 * audit_committee group membership.
 */

import { db } from "@/lib/database";

/**
 * Check if a user has access to the financial dashboard
 * User must be in the audit_committee group
 *
 * @param email - The user's email address
 * @returns true if user can access financial dashboard, false otherwise
 */
export async function canAccessFinancialDashboard(
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const groups = await db.getGroupsForUser(normalizedEmail);

    // Check if user is in the audit_committee group
    return groups.some(
      (group: { id: string; name: string }) => group.id === "audit_committee"
    );
  } catch (error) {
    console.error("Error checking financial dashboard access:", error);
    return false;
  }
}

/**
 * Check if a user is a board member (for redirect purposes)
 *
 * @param email - The user's email address
 * @returns true if user is a board member, false otherwise
 */
export async function isBoardMemberWithGroups(
  email: string | null | undefined
): Promise<boolean> {
  if (!email) return false;

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const groups = await db.getGroupsForUser(normalizedEmail);

    // Check if user is in the board_member group
    return groups.some(
      (group: { id: string; name: string }) => group.id === "board_member"
    );
  } catch (error) {
    console.error("Error checking board member status:", error);
    return false;
  }
}
