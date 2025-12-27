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

  // Get user ID for profile lookup (TypeScript narrowing)
  const userId = session.user.info.id;

  // Find user's profile
  const userProfile = profiles.find(
    (profile) => profile.userId === userId
  );

  if (!userProfile) {
    // Return default empty profile
    return {
      data: {
        userId: userId,
        rssTopic: "",
      },
    };
  }

  return { data: userProfile };
}
