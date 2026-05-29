"use server";

import { auth } from "@/auth";
import { canUpdateStatistics } from "@/lib/auth/admin";
import { db } from "@/lib/database";

interface AttendanceData {
  meetingId: number;
  memberName: string;
  memberEmail: string;
  attendance: "absent" | "half_time" | "full_time";
  prepared: boolean;
  inPerson: boolean;
}

export async function upsertAttendance(data: AttendanceData) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canUpdateStatistics(userEmail)) {
      return {
        error: { code: 403, message: "Unauthorized - Admin access required" },
      };
    }

    const result = await db.upsertAttendance(
      data.meetingId,
      data.memberName,
      data.memberEmail,
      data.attendance,
      data.prepared,
      data.inPerson
    );

    return {
      data: {
        id: result.id,
        meetingId: result.meeting_id,
        memberName: result.member_name,
        memberEmail: result.member_email,
        attendance: result.attendance,
        prepared: result.prepared,
        inPerson: result.in_person,
      },
    };
  } catch (error) {
    console.error("Error saving attendance:", error);
    return {
      error: { code: 500, message: "Failed to save attendance" },
    };
  }
}
