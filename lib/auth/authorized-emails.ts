/**
 * Whitelist of authorized email addresses for Board access
 *
 * To grant someone access:
 * 1. Add their email address to this list
 * 2. Commit and push to deploy
 */

export const AUTHORIZED_EMAILS = [
  // Board Members - Add authorized emails here
  "zack@xogos.io",
  "your-email@example.com", // Replace with actual board member emails

  // Add more authorized emails below:
];

/**
 * Check if an email is authorized for Board access
 */
export function isAuthorizedEmail(email: string | null | undefined): boolean {
  if (!email) return false;

  // Case-insensitive comparison
  const normalizedEmail = email.toLowerCase().trim();
  return AUTHORIZED_EMAILS.some(
    (authorizedEmail) => authorizedEmail.toLowerCase() === normalizedEmail
  );
}
