"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";

interface VisitStats {
  totalVisits: number;
  uniqueVisitors: number;
  boardRoomVisits: number;
  boardRoomUniqueVisitors: number;
  pageBreakdown: {
    pagePath: string;
    pageName: string | null;
    visitCount: number;
    uniqueVisitors: number;
  }[];
}

/**
 * Get page visit statistics (admin only)
 */
export async function getVisitStats(
  days: number = 30
): Promise<{ data?: VisitStats; error?: { message: string } }> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: { message: "Not authenticated" } };
  }

  if (!isAdmin(session.user.email)) {
    return { error: { message: "Not authorized" } };
  }

  try {
    const { db } = await import("@/lib/database");

    // Get total site visits
    const totalStats = await db.getTotalVisits(days);

    // Get board room visits specifically
    const boardRoomStats = await db.getPageVisits("/board", days);

    // Get breakdown by page
    const pageBreakdown = await db.getPageVisitStats(days);

    return {
      data: {
        totalVisits: parseInt(totalStats?.total_visits || "0"),
        uniqueVisitors: parseInt(totalStats?.unique_visitors || "0"),
        boardRoomVisits: parseInt(boardRoomStats?.visit_count || "0"),
        boardRoomUniqueVisitors: parseInt(boardRoomStats?.unique_visitors || "0"),
        pageBreakdown: pageBreakdown.map((p) => ({
          pagePath: p.page_path,
          pageName: p.page_name,
          visitCount: parseInt(p.visit_count),
          uniqueVisitors: parseInt(p.unique_visitors),
        })),
      },
    };
  } catch (error) {
    console.error("Error fetching visit stats:", error);
    return { error: { message: "Failed to fetch visit statistics" } };
  }
}
