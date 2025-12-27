import { XogosFinancials } from "@/types/dashboard";

/**
 * This object simulates a database for Xogos financials.
 * Admins (Zack Edwards and Michael Weaver) can update these values
 * through the admin interface.
 */
export const financials: XogosFinancials = {
  revenue: 0,
  expenses: 0,
  monthlyPayments: 0,
  yearlyPayments: 0,
  lifetimeMembers: 0,
  lastUpdated: new Date().toISOString(),
  updatedBy: "zack@xogosgaming.com",
};
