/**
 * Admin authorization utilities
 *
 * Defines who has admin access to manage statistics, financials, and checklists.
 */

export const ADMIN_EMAILS = [
  "zack@xogosgaming.com",
  "enjoyweaver@gmail.com", // Michael Weaver
];

/**
 * Only Zack can update Xogos statistics and financials
 */
export const STATISTICS_ADMIN_EMAILS = ["zack@xogosgaming.com"];

/**
 * Check if a user email has admin access
 *
 * @param email - The user's email address
 * @returns true if user is an admin, false otherwise
 */
export function isAdmin(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );
}

/**
 * Check if a user can update statistics and financials
 *
 * @param email - The user's email address
 * @returns true if user can update statistics, false otherwise
 */
export function canUpdateStatistics(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return STATISTICS_ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );
}
