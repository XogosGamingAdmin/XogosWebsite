"use server";

import { auth } from "@/auth";
import { getDraftsGroupName } from "@/lib/utils";
import { liveblocks } from "@/liveblocks.server.config";
import { User } from "@/types";

export async function authorizeLiveblocks() {
  console.log("🔐 authorizeLiveblocks called");

  // Get current session from NextAuth
  const session = await auth();

  console.log("Session exists:", !!session);
  console.log("Session user exists:", !!session?.user);
  console.log("Session user info exists:", !!session?.user?.info);

  // If no session or no user info, deny access
  if (!session || !session.user?.info) {
    console.error("❌ Liveblocks auth failed: No session or user info");
    console.error("Session:", JSON.stringify(session, null, 2));
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

  console.log("👤 User info:", { name, id, groupIds: groupIdsWithDraftsGroup.length });

  // Get Liveblocks ID token
  let liveblocksResponse;
  try {
    liveblocksResponse = await liveblocks.identifyUser(
      {
        userId: id,
        groupIds: groupIdsWithDraftsGroup,
      },
      {
        userInfo: { name, color, avatar },
      }
    );
  } catch (err) {
    console.error("❌ Liveblocks identifyUser failed:", err);
    return {
      error: {
        code: 500,
        message: "Liveblocks authentication failed",
        suggestion: "Check LIVEBLOCKS_SECRET_KEY environment variable",
      },
    };
  }

  const { status, body } = liveblocksResponse;

  console.log("📡 Liveblocks response status:", status);

  if (status !== 200) {
    console.error("❌ Liveblocks returned non-200 status:", status);
    return {
      error: {
        code: 401,
        message: "No access",
        suggestion: "You don't have access to this Liveblocks room",
      },
    };
  }

  if (!body) {
    console.error("❌ Liveblocks returned empty body");
    return {
      error: {
        code: 404,
        message: "ID token issue",
        suggestion: "Contact an administrator",
      },
    };
  }

  console.log("✅ Liveblocks authentication successful");
  return { data: JSON.parse(body) };
}
