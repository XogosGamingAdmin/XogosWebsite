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
