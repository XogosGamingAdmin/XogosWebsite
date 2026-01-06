"use server";

import { auth } from "@/auth";
import { BoardMemberProfile } from "@/types/dashboard";

type Props = {
  rssTopic: string;
};

/**
 * Update RSS Topic
 *
 * Updates the current user's RSS topic preference
 * In a production environment, this would update a database
 *
 * @param rssTopic - The new RSS topic
 */
export async function updateRssTopic({ rssTopic }: Props) {
  const session = await auth();

  // Check user is logged in
  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to update your RSS topic",
      },
    };
  }

  // NOTE: In a production environment, this would update a database
  // For now, we're using static files, so this would need to be
  // manually updated or use a different storage mechanism
  const updatedProfile: BoardMemberProfile = {
    userId: session.user.info.id,
    rssTopic,
  };

  return { data: updatedProfile };
}
