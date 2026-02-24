"use server";

import { auth } from "@/auth";
import { canAccessFinancialDashboard } from "@/lib/auth/financial";
import { db } from "@/lib/database";

export interface MembershipMetrics {
  totalMembers: number;
  membersByType: {
    monthly: number;
    yearly: number;
    lifetime: number;
  };
  stripeMembers: {
    monthly: number;
    yearly: number;
    lifetime: number;
  };
  manualMembers: {
    monthly: number;
    yearly: number;
    lifetime: number;
  };
  newMembersThisMonth: number;
  membersLostThisMonth: number;
  revenueThisMonth: number;
  stripeRevenue: number;
  manualRevenue: number;
  currency: string;
  churnRate: number;
  revenueTrend: Array<{
    month: string;
    total: number;
  }>;
}

/**
 * Get membership metrics for the financial dashboard
 * Combines Stripe data with manual entries
 */
export async function getMembershipMetrics(): Promise<MembershipMetrics | null> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    // Check if user has access to financial dashboard
    const hasAccess = canAccessFinancialDashboard(userEmail);
    if (!hasAccess) {
      console.error("User does not have access to financial dashboard");
      return null;
    }

    // Get Stripe metrics
    const stripeMetrics = await db.getMembershipMetrics();

    // Get manual entry totals
    const manualMembers = await db.getManualMemberTotals();
    const manualRevenue = await db.getManualRevenueThisMonth();
    const manualMembersThisMonth = await db.getManualMembersThisMonth();

    // Combine totals
    const combinedMembers = {
      monthly: (stripeMetrics.membersByType.monthly || 0) + (manualMembers.monthly || 0),
      yearly: (stripeMetrics.membersByType.yearly || 0) + (manualMembers.yearly || 0),
      lifetime: (stripeMetrics.membersByType.lifetime || 0) + (manualMembers.lifetime || 0),
    };

    const totalMembers = combinedMembers.monthly + combinedMembers.yearly + combinedMembers.lifetime;
    const totalRevenue = stripeMetrics.revenueThisMonth + manualRevenue.total;
    const totalNewThisMonth = stripeMetrics.newMembersThisMonth + manualMembersThisMonth;

    return {
      totalMembers,
      membersByType: combinedMembers,
      stripeMembers: {
        monthly: stripeMetrics.membersByType.monthly || 0,
        yearly: stripeMetrics.membersByType.yearly || 0,
        lifetime: stripeMetrics.membersByType.lifetime || 0,
      },
      manualMembers: {
        monthly: manualMembers.monthly || 0,
        yearly: manualMembers.yearly || 0,
        lifetime: manualMembers.lifetime || 0,
      },
      newMembersThisMonth: totalNewThisMonth,
      membersLostThisMonth: stripeMetrics.membersLostThisMonth,
      revenueThisMonth: totalRevenue,
      stripeRevenue: stripeMetrics.revenueThisMonth,
      manualRevenue: manualRevenue.total,
      currency: stripeMetrics.currency || manualRevenue.currency || "usd",
      churnRate: stripeMetrics.churnRate,
      revenueTrend: stripeMetrics.revenueTrend,
    };
  } catch (error) {
    console.error("Error fetching membership metrics:", error);
    return null;
  }
}

/**
 * Get recent Stripe events for the financial dashboard
 */
export async function getRecentStripeEvents(limit: number = 20) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    const hasAccess = canAccessFinancialDashboard(userEmail);
    if (!hasAccess) {
      return null;
    }

    return await db.getRecentStripeEvents(limit);
  } catch (error) {
    console.error("Error fetching Stripe events:", error);
    return null;
  }
}
