"use server";

import { financials } from "@/data/financials";

/**
 * Get Financials
 *
 * Retrieves the current Xogos financials data
 */
export async function getFinancials() {
  return { data: financials };
}
