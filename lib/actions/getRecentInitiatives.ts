"use server";

import { auth } from "@/auth";

interface Initiative {
  id: string;
  memberId: string;
  memberName: string;
  memberTitle: string;
  memberImage: string;
  title: string;
  description: string;
  createdAt: string;
}

/**
 * Get recent board member initiatives (for dashboard)
 */
export async function getRecentInitiatives(
  limit: number = 5
): Promise<{ data?: Initiative[]; error?: { message: string } }> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: { message: "Not authenticated" } };
  }

  try {
    const { query } = await import("@/lib/database");
    const result = await query(
      `SELECT id, member_id, member_name, member_title, member_image,
              title, description, created_at
       FROM board_initiatives
       ORDER BY created_at DESC
       LIMIT $1`,
      [limit]
    );

    return {
      data: result.rows.map((row) => ({
        id: row.id,
        memberId: row.member_id,
        memberName: row.member_name,
        memberTitle: row.member_title,
        memberImage: row.member_image,
        title: row.title,
        description: row.description,
        createdAt: row.created_at,
      })),
    };
  } catch (error) {
    console.error("Error fetching recent initiatives:", error);
    return { error: { message: "Failed to fetch initiatives" } };
  }
}
