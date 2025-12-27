"use server";

import { auth } from "@/auth";
import { profiles } from "@/data/profiles";

/**
 * Get Profile
 *
 * Retrieves the current user's profile preferences
 */
export async function getProfile() {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to view your profile",
      },
    };
  }

  // Find user's profile
  const userProfile = profiles.find(
    (profile) => profile.userId === session.user.info.id
  );

  if (!userProfile) {
    // Return default empty profile
    return {
      data: {
        userId: session.user.info.id,
        rssTopic: "",
      },
    };
  }

  return { data: userProfile };
}
