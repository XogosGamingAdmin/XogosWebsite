import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [allSkills, statistics, membersWithSkills] =
      await Promise.all([
        db.getAllSkillsByEmail(),
        db.getSkillsStatsByEmail(),
        db.getMembersWithSkillsByEmail(),
      ]);

    return NextResponse.json({
      allSkills,
      statistics,
      membersWithSkills,
    });
  } catch (error) {
    console.error("Error fetching skills data:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills data" },
      { status: 500 }
    );
  }
}
