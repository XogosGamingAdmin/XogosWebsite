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
 * Only Zack can manage blog posts
 */
export const BLOG_ADMIN_EMAILS = ["zack@xogosgaming.com"];

/**
 * All board members who can submit public initiatives
 */
export const BOARD_MEMBER_EMAILS = [
  "zack@xogosgaming.com",
  "enjoyweaver@gmail.com",
  "braden@kennyhertzperry.com",
  "terrence@terrencegatsby.com",
  "sturs49@gmail.com",
  "mckaylaareece@gmail.com",
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

/**
 * Check if a user can manage blog posts
 *
 * @param email - The user's email address
 * @returns true if user can manage blog posts, false otherwise
 */
export function canManageBlog(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return BLOG_ADMIN_EMAILS.some(
    (adminEmail) => adminEmail.toLowerCase() === normalizedEmail
  );
}

/**
 * Check if a user is a board member who can submit initiatives
 *
 * @param email - The user's email address
 * @returns true if user is a board member, false otherwise
 */
export function isBoardMember(email: string | null | undefined): boolean {
  if (!email) return false;
  const normalizedEmail = email.toLowerCase().trim();
  return BOARD_MEMBER_EMAILS.some(
    (memberEmail) => memberEmail.toLowerCase() === normalizedEmail
  );
}

/**
 * Get board member info by email
 */
export function getBoardMemberByEmail(email: string | null | undefined): {
  id: string;
  name: string;
  title: string;
  role: string;
  imagePath: string;
} | null {
  if (!email) return null;
  const normalizedEmail = email.toLowerCase().trim();

  const memberMap: Record<string, { id: string; name: string; title: string; role: string; imagePath: string }> = {
    "zack@xogosgaming.com": {
      id: "zack-edwards",
      name: "Zack Edwards",
      title: "CEO",
      role: "Executive Oversight",
      imagePath: "/images/board/zack.png",
    },
    "enjoyweaver@gmail.com": {
      id: "michael-weaver",
      name: "Michael Weaver",
      title: "President",
      role: "Insurance & Risk",
      imagePath: "/images/board/weaver.jpg",
    },
    "braden@kennyhertzperry.com": {
      id: "braden-perry",
      name: "Braden Perry",
      title: "Legal Director",
      role: "Legal & Regulatory",
      imagePath: "/images/board/braden.jpg",
    },
    "terrence@terrencegatsby.com": {
      id: "terrance-gatsby",
      name: "Terrance Gatsby",
      title: "Crypto & Exchanges Director",
      role: "Cryptocurrency Integration",
      imagePath: "/images/board/terrance.jpg",
    },
    "sturs49@gmail.com": {
      id: "kevin-stursberg",
      name: "Kevin Stursberg",
      title: "Accounting Director",
      role: "Financial Oversight",
      imagePath: "/images/board/kevin.jpg",
    },
    "mckaylaareece@gmail.com": {
      id: "mckayla-reece",
      name: "McKayla Reece",
      title: "Education Director",
      role: "Educational Strategy",
      imagePath: "/images/board/mckayla.jpg",
    },
  };

  return memberMap[normalizedEmail] || null;
}
