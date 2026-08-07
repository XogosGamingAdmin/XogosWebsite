/**
 * Authorization for the board Document Reviewer.
 *
 * Two levels:
 *  - Reviewers  : any authorized board member. Can read documents, highlight,
 *                 comment, and reply.
 *  - Managers   : admins only. Can upload, hide/restore, and delete.
 */

import { ADMIN_EMAILS, BOARD_MEMBER_EMAILS } from "./admin";
import { AUTHORIZED_EMAILS } from "./authorized-emails";

const normalize = (email: string): string => email.toLowerCase().trim();

/**
 * Everyone allowed into the board-secured area can review documents.
 * Union of the boardroom whitelist and the board member list so a member
 * added to either place gets access.
 */
const REVIEWER_EMAILS = Array.from(
  new Set([...AUTHORIZED_EMAILS, ...BOARD_MEMBER_EMAILS].map(normalize))
);

export function canReviewDocuments(email: string | null | undefined): boolean {
  if (!email) return false;
  return REVIEWER_EMAILS.includes(normalize(email));
}

/**
 * Upload, hide/restore, and delete are admin-only.
 */
export function canManageDocuments(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalized = normalize(email);
  return ADMIN_EMAILS.some((admin) => normalize(admin) === normalized);
}
