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
    const financials = await db.getFinancials();

    if (!financials) {
      return NextResponse.json(
        { totalMembers: 0 },
        { status: 200 }
      );
    }

    // Calculate total members by combining all member types
    const totalMembers =
      Number(financials.monthly_payments || 0) +
      Number(financials.yearly_payments || 0) +
      Number(financials.lifetime_members || 0);

    return NextResponse.json({
      totalMembers,
    });
  } catch (error) {
    console.error("Error fetching public stats:", error);
    return NextResponse.json(
      { totalMembers: 0 },
      { status: 200 }
    );
  }
}
