"use server";

import { auth } from "@/auth";
import { getDraftsGroupName } from "@/lib/utils";
import { liveblocks } from "@/liveblocks.server.config";
import { User } from "@/types";

export async function authorizeLiveblocks() {
  // Get current session from NextAuth
  const session = await auth();

  // If no session or no user info, deny access
  if (!session || !session.user?.info) {
    console.error("Liveblocks auth failed: No session or user info");
    return {
      error: {
        code: 401,
        message: "Not authenticated",
        suggestion: "Please sign in to access Liveblocks",
      },
    };
  }

  // Get current user info from session
  const {
    name,
    avatar,
    color,
    id,
    groupIds = [],
  } = session.user.info;

  const groupIdsWithDraftsGroup = [...groupIds, getDraftsGroupName(id)];

  // Get Liveblocks ID token
  const { status, body } = await liveblocks.identifyUser(
    {
      userId: id,
      groupIds: groupIdsWithDraftsGroup,
    },
    {
      userInfo: { name, color, avatar },
    }
  );

  if (status !== 200) {
    return {
      error: {
        code: 401,
        message: "No access",
        suggestion: "You don't have access to this Liveblocks room",
      },
    };
  }

  if (!body) {
    return {
      error: {
        code: 404,
        message: "ID token issue",
        suggestion: "Contact an administrator",
      },
    };
  }

  return { data: JSON.parse(body) };
}
