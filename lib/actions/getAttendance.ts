"use server";

import { db } from "@/lib/database";

export async function getAttendance() {
  try {
    const attendance = await db.getAllAttendance();
    return {
      data: attendance.map((a) => ({
        id: a.id,
        meetingId: a.meeting_id,
        memberName: a.member_name,
        memberEmail: a.member_email,
        attendance: a.attendance,
        prepared: a.prepared,
        inPerson: a.in_person,
        meetingDate: a.meeting_date,
        meetingName: a.meeting_name,
      })),
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      error: { code: 500, message: "Failed to fetch attendance" },
    };
  }
}

export async function getAttendanceByMeeting(meetingId: number) {
  try {
    const attendance = await db.getAttendanceByMeeting(meetingId);
    return {
      data: attendance.map((a) => ({
        id: a.id,
        meetingId: a.meeting_id,
        memberName: a.member_name,
        memberEmail: a.member_email,
        attendance: a.attendance,
        prepared: a.prepared,
        inPerson: a.in_person,
      })),
    };
  } catch (error) {
    console.error("Error fetching attendance:", error);
    return {
      error: { code: 500, message: "Failed to fetch attendance" },
    };
  }
}
