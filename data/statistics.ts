import { XogosStatistics } from "@/types/dashboard";

/**
 * This object simulates a database for Xogos statistics.
 * Admins (Zack Edwards and Michael Weaver) can update these values
 * through the admin interface.
 */
export const statistics: XogosStatistics = {
  accounts: 0,
  activeUsers: 0,
  totalHours: 0,
  lastUpdated: new Date().toISOString(),
  updatedBy: "zack@xogosgaming.com",
};
