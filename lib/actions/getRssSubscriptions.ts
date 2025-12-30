"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";

/**
 * Get RSS Subscriptions
 *
 * Retrieves all RSS feed subscriptions for the current user
 */
export async function getRssSubscriptions() {
  const session = await auth();

  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to view your RSS subscriptions",
      },
    };
  }

  try {
    const subscriptions = await db.getRssSubscriptions(session.user.email);

    return {
      data: subscriptions.map((sub) => ({
        id: sub.id,
        userId: sub.user_id,
        topic: sub.topic,
        displayName: sub.display_name,
        createdAt: sub.created_at.toISOString(),
      })),
    };
  } catch (error) {
    console.error("Error fetching RSS subscriptions:", error);
    return {
      error: {
        code: 500,
        message: "Failed to fetch RSS subscriptions",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
