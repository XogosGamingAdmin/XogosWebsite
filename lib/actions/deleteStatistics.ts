"use server";

import { auth } from "@/auth";
import { canUpdateStatistics } from "@/lib/auth/admin";
import { db } from "@/lib/database";

export async function deleteStatistics(id: number) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canUpdateStatistics(userEmail)) {
      return {
        error: {
          code: 403,
          message: "Unauthorized - Only statistics admins can delete records",
        },
      };
    }

    await db.deleteStatistics(id);

    return { success: true };
  } catch (error) {
    console.error("Error deleting statistics:", error);
    return {
      error: {
        code: 500,
        message: "Failed to delete statistics record",
      },
    };
  }
}
