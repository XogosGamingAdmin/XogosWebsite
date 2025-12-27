import { BoardMemberProfile } from "@/types/dashboard";

/**
 * This array simulates a database for board member profile preferences.
 * Each board member can configure their own RSS topic through the Profile page.
 */
export const profiles: BoardMemberProfile[] = [
  { userId: "enjoyweaver@gmail.com", rssTopic: "blockchain technology" },
  { userId: "zack@xogosgaming.com", rssTopic: "education technology" },
  { userId: "braden@kennyhertzperry.com", rssTopic: "legal technology" },
  { userId: "terrence@terrencegatsby.com", rssTopic: "gaming industry" },
  { userId: "sturs49@gmail.com", rssTopic: "business news" },
  { userId: "mckaylaareece@gmail.com", rssTopic: "educational games" },
];
