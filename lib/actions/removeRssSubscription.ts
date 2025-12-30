"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";

type Props = {
  id: string;
};

/**
 * Remove RSS Subscription
 *
 * Removes an RSS feed subscription for the current user
 *
 * @param id - The subscription ID to remove
 */
export async function removeRssSubscription({ id }: Props) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to remove RSS subscriptions",
      },
    };
  }

  if (!id || id.trim() === "") {
    return {
      error: {
        code: 400,
        message: "ID is required",
        suggestion: "Please provide a valid subscription ID",
      },
    };
  }

  try {
    await db.removeRssSubscription(id, session.user.email);

    return {
      data: {
        success: true,
        message: "RSS subscription removed successfully",
      },
    };
  } catch (error) {
    console.error("Error removing RSS subscription:", error);
    return {
      error: {
        code: 500,
        message: "Failed to remove RSS subscription",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
