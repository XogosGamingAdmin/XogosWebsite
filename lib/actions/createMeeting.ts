"use server";

import { auth } from "@/auth";
import { canUpdateStatistics } from "@/lib/auth/admin";
import { db } from "@/lib/database";

export async function createMeeting(meetingDate: string, meetingName: string) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canUpdateStatistics(userEmail)) {
      return {
        error: { code: 403, message: "Unauthorized - Admin access required" },
      };
    }

    const meeting = await db.createMeeting(meetingDate, meetingName, userEmail!);
    return {
      data: {
        id: meeting.id,
        meetingDate: meeting.meeting_date,
        meetingName: meeting.meeting_name,
        createdAt: meeting.created_at,
        createdBy: meeting.created_by,
      },
    };
  } catch (error) {
    console.error("Error creating meeting:", error);
    return {
      error: { code: 500, message: "Failed to create meeting" },
    };
  }
}
