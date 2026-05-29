"use server";

import { auth } from "@/auth";
import { canUpdateStatistics } from "@/lib/auth/admin";
import { db } from "@/lib/database";

export async function deleteMeeting(id: number) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canUpdateStatistics(userEmail)) {
      return {
        error: { code: 403, message: "Unauthorized - Admin access required" },
      };
    }

    await db.deleteMeeting(id);
    return { success: true };
  } catch (error) {
    console.error("Error deleting meeting:", error);
    return {
      error: { code: 500, message: "Failed to delete meeting" },
    };
  }
}
