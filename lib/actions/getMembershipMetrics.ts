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
  newMembersThisMonth: number;
  membersLostThisMonth: number;
  revenueThisMonth: number;
  currency: string;
  churnRate: number;
  revenueTrend: Array<{
    month: string;
    total: number;
  }>;
}

/**
 * Get membership metrics for the financial dashboard
 * Only accessible by users in the audit_committee group
 */
export async function getMembershipMetrics(): Promise<MembershipMetrics | null> {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    // Check if user has access to financial dashboard
    const hasAccess = await canAccessFinancialDashboard(userEmail);
    if (!hasAccess) {
      console.error("User does not have access to financial dashboard");
      return null;
    }

    const metrics = await db.getMembershipMetrics();

    return {
      totalMembers: metrics.totalMembers,
      membersByType: {
        monthly: metrics.membersByType.monthly || 0,
        yearly: metrics.membersByType.yearly || 0,
        lifetime: metrics.membersByType.lifetime || 0,
      },
      newMembersThisMonth: metrics.newMembersThisMonth,
      membersLostThisMonth: metrics.membersLostThisMonth,
      revenueThisMonth: metrics.revenueThisMonth,
      currency: metrics.currency,
      churnRate: metrics.churnRate,
      revenueTrend: metrics.revenueTrend,
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

    const hasAccess = await canAccessFinancialDashboard(userEmail);
    if (!hasAccess) {
      return null;
    }

    return await db.getRecentStripeEvents(limit);
  } catch (error) {
    console.error("Error fetching Stripe events:", error);
    return null;
  }
}
