import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { isBoardMember } from "@/lib/auth/admin";

// GET - Get current user's initiatives
export async function GET() {
  try {
    // Check authentication
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if user is a board member
    if (!isBoardMember(session.user.email)) {
      return NextResponse.json({ error: "Board member access required" }, { status: 403 });
    }

    const { query } = await import("@/lib/database");
    const result = await query(
      `SELECT id, title, description, objectives, created_at
       FROM board_initiatives
       WHERE member_email = $1
       ORDER BY created_at DESC`,
      [session.user.email]
    );

    const initiatives = result.rows.map((row: {
      id: string;
      title: string;
      description: string;
      objectives: string[];
      created_at: string;
    }) => ({
      id: row.id,
      title: row.title,
      description: row.description,
      objectives: row.objectives,
      createdAt: row.created_at,
    }));

    return NextResponse.json({ initiatives });
  } catch (error) {
    console.error("Error fetching user initiatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch initiatives", initiatives: [] },
      { status: 500 }
    );
  }
}
