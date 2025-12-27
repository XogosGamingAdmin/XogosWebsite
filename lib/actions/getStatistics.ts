"use server";

import { statistics } from "@/data/statistics";

/**
 * Get Statistics
 *
 * Retrieves the current Xogos statistics data
 */
export async function getStatistics() {
  return { data: statistics };
}
