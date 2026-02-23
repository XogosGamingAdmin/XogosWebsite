/**
 * Financial dashboard authorization utilities
 *
 * Determines who has access to the financial dashboard.
 */

/**
 * Emails authorized to access the Financial Dashboard
 * Add emails here to grant access
 */
export const FINANCIAL_ADMIN_EMAILS = [
  "zack@xogosgaming.com",
  "enjoyweaver@gmail.com",
];

/**
 * Check if a user has access to the financial dashboard
 *
 * @param email - The user's email address
 * @returns true if user can access financial dashboard, false otherwise
 */
export function canAccessFinancialDashboard(
  email: string | null | undefined
): boolean {
  if (!email) return false;

  const normalizedEmail = email.toLowerCase().trim();
  return FINANCIAL_ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );
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
