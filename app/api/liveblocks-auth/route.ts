import { auth } from "@/auth";
import { getDraftsGroupName } from "@/lib/utils";
import { liveblocks } from "@/liveblocks.server.config";

export async function POST() {
  console.log("🔐 [API] Liveblocks auth route called");

  // Get current session from NextAuth
  const session = await auth();

  console.log("Session exists:", !!session);
  console.log("Session user exists:", !!session?.user);
  console.log("Session user info exists:", !!session?.user?.info);

  // If no session or no user info, deny access
  if (!session || !session.user?.info) {
    console.error("❌ [API] No session or user info");
    return new Response(
      JSON.stringify({
        error: "Not authenticated",
      }),
      { status: 401 }
    );
  }

  // Get current user info from session
  const { name, avatar, color, id, groupIds = [] } = session.user.info;

  const groupIdsWithDraftsGroup = [...groupIds, getDraftsGroupName(id)];

  console.log("👤 [API] User info:", {
    name,
    id,
    groupIds: groupIdsWithDraftsGroup.length,
  });

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
    console.error("❌ [API] Liveblocks identifyUser failed:", err);
    return new Response(
      JSON.stringify({
        error: "Liveblocks authentication failed",
      }),
      { status: 500 }
    );
  }

  const { status, body } = liveblocksResponse;

  console.log("📡 [API] Liveblocks response status:", status);

  if (status !== 200) {
    console.error("❌ [API] Liveblocks returned non-200 status:", status);
    return new Response(body, { status });
  }

  if (!body) {
    console.error("❌ [API] Liveblocks returned empty body");
    return new Response(
      JSON.stringify({
        error: "No token received",
      }),
      { status: 500 }
    );
  }

  console.log("✅ [API] Liveblocks authentication successful");
  console.log("📦 [API] Body preview:", body.substring(0, 100));

  // Return the Liveblocks response directly
  return new Response(body, { status: 200 });
}
