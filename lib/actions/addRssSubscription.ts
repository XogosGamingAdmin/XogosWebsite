"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";

type Props = {
  topic: string;
  displayName?: string;
};

/**
 * Add RSS Subscription
 *
 * Adds a new RSS feed subscription for the current user
 *
 * @param topic - The RSS topic/search term
 * @param displayName - Optional display name for the feed
 */
export async function addRssSubscription({ topic, displayName }: Props) {
  const session = await auth();

  if (!session || !session.user?.email) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to add RSS subscriptions",
      },
    };
  }

  if (!topic || topic.trim() === "") {
    return {
      error: {
        code: 400,
        message: "Topic is required",
        suggestion: "Please enter a valid topic",
      },
    };
  }

  try {
    const subscription = await db.addRssSubscription(
      session.user.email,
      topic.trim(),
      displayName?.trim()
    );

    return {
      data: {
        id: subscription.id,
        userId: subscription.user_id,
        topic: subscription.topic,
        displayName: subscription.display_name,
        createdAt: subscription.created_at.toISOString(),
      },
    };
  } catch (error) {
    console.error("Error adding RSS subscription:", error);
    return {
      error: {
        code: 500,
        message: "Failed to add RSS subscription",
        suggestion: "Check database connection and try again",
      },
    };
  }
}
