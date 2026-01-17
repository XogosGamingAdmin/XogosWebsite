import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isBoardMember, getBoardMemberByEmail } from "@/lib/auth/admin";

// GET - Get all initiatives (public)
export async function GET() {
  try {
    const { query } = await import("@/lib/database");
    const result = await query(
      `SELECT id, member_id, member_name, member_title, member_role, member_image,
              title, description, objectives, created_at
       FROM board_initiatives
       ORDER BY created_at DESC`
    );

    // Group initiatives by member
    const initiativesByMember: Record<string, {
      memberId: string;
      memberName: string;
      memberTitle: string;
      memberRole: string;
      memberImage: string;
      initiatives: Array<{
        id: string;
        title: string;
        description: string;
        objectives: string[];
        createdAt: string;
      }>;
    }> = {};

    for (const row of result.rows) {
      if (!initiativesByMember[row.member_id]) {
        initiativesByMember[row.member_id] = {
          memberId: row.member_id,
          memberName: row.member_name,
          memberTitle: row.member_title,
          memberRole: row.member_role,
          memberImage: row.member_image,
          initiatives: [],
        };
      }
      initiativesByMember[row.member_id].initiatives.push({
        id: row.id,
        title: row.title,
        description: row.description,
        objectives: row.objectives,
        createdAt: row.created_at,
      });
    }

    return NextResponse.json({
      initiativesByMember: Object.values(initiativesByMember),
    });
  } catch (error) {
    console.error("Error fetching initiatives:", error);
    return NextResponse.json(
      { error: "Failed to fetch initiatives", initiativesByMember: [] },
      { status: 500 }
    );
  }
}

// POST - Create a new initiative (board members only)
export async function POST(request: NextRequest) {
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

    const memberInfo = getBoardMemberByEmail(session.user.email);
    if (!memberInfo) {
      return NextResponse.json({ error: "Member info not found" }, { status: 400 });
    }

    const body = await request.json();
    const { title, description, objectives } = body;

    if (!title || !description || !objectives || objectives.length === 0) {
      return NextResponse.json(
        { error: "Title, description, and at least one objective are required" },
        { status: 400 }
      );
    }

    // Store in database
    const { query } = await import("@/lib/database");
    const result = await query(
      `INSERT INTO board_initiatives
        (member_id, member_email, member_name, member_title, member_role, member_image, title, description, objectives)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING id, title, created_at`,
      [
        memberInfo.id,
        session.user.email,
        memberInfo.name,
        memberInfo.title,
        memberInfo.role,
        memberInfo.imagePath,
        title,
        description,
        objectives,
      ]
    );

    return NextResponse.json({
      id: result.rows[0].id,
      message: "Initiative published successfully",
    });
  } catch (error) {
    console.error("Error creating initiative:", error);
    return NextResponse.json(
      { error: "Failed to create initiative" },
      { status: 500 }
    );
  }
}
