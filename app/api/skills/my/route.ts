import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/lib/database";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const mySkills = await db.getSkillsByEmail(session.user.email);

    return NextResponse.json({
      mySkills,
      user: {
        email: session.user.email,
        name: session.user.name,
      },
    });
  } catch (error) {
    console.error("Error fetching my skills:", error);
    return NextResponse.json(
      { error: "Failed to fetch skills" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { skills } = body;

    if (!skills || !Array.isArray(skills)) {
      return NextResponse.json(
        { error: "Skills array is required" },
        { status: 400 }
      );
    }

    const validatedSkills = skills.map((skill) => ({
      skillCategory: String(skill.skillCategory),
      skillName: String(skill.skillName),
      proficiencyLevel: Math.min(5, Math.max(1, Number(skill.proficiencyLevel))),
      notes: skill.notes ? String(skill.notes) : undefined,
    }));

    const results = await db.bulkUpsertSkillsByEmail(
      session.user.email,
      session.user.name || "Unknown",
      session.user.image || null,
      validatedSkills
    );

    return NextResponse.json({
      success: true,
      updated: results.length,
      skills: results,
    });
  } catch (error) {
    console.error("Error saving skills:", error);
    return NextResponse.json(
      { error: "Failed to save skills" },
      { status: 500 }
    );
  }
}
