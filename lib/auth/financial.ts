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
