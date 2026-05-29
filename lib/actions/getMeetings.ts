"use server";

import { db } from "@/lib/database";

export async function getMeetings() {
  try {
    const meetings = await db.getMeetings();
    return {
      data: meetings.map((m) => ({
        id: m.id,
        meetingDate: m.meeting_date,
        meetingName: m.meeting_name,
        createdAt: m.created_at,
        createdBy: m.created_by,
      })),
    };
  } catch (error) {
    console.error("Error fetching meetings:", error);
    return {
      error: { code: 500, message: "Failed to fetch meetings" },
    };
  }
}
