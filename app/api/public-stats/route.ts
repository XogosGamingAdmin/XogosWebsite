import { NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * Public Stats API
 *
 * Returns aggregated member statistics for public display.
 * This endpoint does not require authentication.
 */
export async function GET() {
  try {
    const [financials, statistics] = await Promise.all([
      db.getFinancials(),
      db.getStatistics(),
    ]);

    // Calculate total members by combining all member types
    const totalMembers = financials
      ? Number(financials.monthly_payments || 0) +
        Number(financials.yearly_payments || 0) +
        Number(financials.lifetime_members || 0)
      : 0;

    // Get accounts (players learning) from statistics
    const playersLearning = statistics ? Number(statistics.accounts || 0) : 0;

    return NextResponse.json({
      totalMembers,
      playersLearning,
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json({ totalMembers: 0, playersLearning: 0 }, { status: 200 });
  }
}
