import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { isBoardMember } from "@/lib/auth/admin";

// GET - Get a single initiative
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { query } = await import("@/lib/database");

    const result = await query(
      `SELECT id, member_id, member_email, member_name, member_title, member_role, member_image,
              title, description, objectives, created_at
       FROM board_initiatives
       WHERE id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
    }

    const row = result.rows[0];
    return NextResponse.json({
      initiative: {
        id: row.id,
        memberId: row.member_id,
        memberEmail: row.member_email,
        memberName: row.member_name,
        memberTitle: row.member_title,
        memberRole: row.member_role,
        memberImage: row.member_image,
        title: row.title,
        description: row.description,
        objectives: row.objectives,
        createdAt: row.created_at,
      },
    });
  } catch (error) {
    console.error("Error fetching initiative:", error);
    return NextResponse.json(
      { error: "Failed to fetch initiative" },
      { status: 500 }
    );
  }
}

// PUT - Update an initiative
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if the initiative belongs to the current user
    const existingResult = await query(
      `SELECT member_email FROM board_initiatives WHERE id = $1`,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
    }

    if (existingResult.rows[0].member_email !== session.user.email) {
      return NextResponse.json(
        { error: "You can only edit your own initiatives" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { title, description, objectives } = body;

    if (!title || !description || !objectives || objectives.length === 0) {
      return NextResponse.json(
        { error: "Title, description, and at least one objective are required" },
        { status: 400 }
      );
    }

    // Ensure objectives is an array of strings
    const objectivesArray = Array.isArray(objectives)
      ? objectives.filter((obj: unknown) => typeof obj === "string" && obj.trim() !== "")
      : [];

    if (objectivesArray.length === 0) {
      return NextResponse.json(
        { error: "At least one objective is required" },
        { status: 400 }
      );
    }

    const result = await query(
      `UPDATE board_initiatives
       SET title = $1, description = $2, objectives = $3
       WHERE id = $4
       RETURNING id, title, description, objectives, created_at`,
      [title, description, objectivesArray, id]
    );

    return NextResponse.json({
      initiative: {
        id: result.rows[0].id,
        title: result.rows[0].title,
        description: result.rows[0].description,
        objectives: result.rows[0].objectives,
        createdAt: result.rows[0].created_at,
      },
      message: "Initiative updated successfully",
    });
  } catch (error) {
    console.error("Error updating initiative:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to update initiative: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE - Delete an initiative
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

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

    // Check if the initiative belongs to the current user
    const existingResult = await query(
      `SELECT member_email FROM board_initiatives WHERE id = $1`,
      [id]
    );

    if (existingResult.rows.length === 0) {
      return NextResponse.json({ error: "Initiative not found" }, { status: 404 });
    }

    if (existingResult.rows[0].member_email !== session.user.email) {
      return NextResponse.json(
        { error: "You can only delete your own initiatives" },
        { status: 403 }
      );
    }

    await query(`DELETE FROM board_initiatives WHERE id = $1`, [id]);

    return NextResponse.json({ message: "Initiative deleted successfully" });
  } catch (error) {
    console.error("Error deleting initiative:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Failed to delete initiative: ${errorMessage}` },
      { status: 500 }
    );
  }
}
