import { auth } from "@/auth";
import { getDraftsGroupName } from "@/lib/utils";
import { liveblocks } from "@/liveblocks.server.config";

export async function POST(request: Request) {
  console.log("🔐 [API] Liveblocks auth route called");

  // Parse request body if provided (for room-specific auth)
  let requestBody: { room?: string } = {};
  try {
    const text = await request.text();
    if (text) {
      requestBody = JSON.parse(text);
      console.log("📝 [API] Request body:", requestBody);
    }
  } catch {
    // No body or invalid JSON - that's OK for ID token auth
    console.log("📝 [API] No request body (normal for ID token auth)");
  }

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
      {
        status: 401,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Get current user info from session
  const { name, avatar, color, id, groupIds = [] } = session.user.info;

  // Ensure all required fields have values
  const safeName = name || "Anonymous User";
  const safeColor = color || "#808080";
  const safeAvatar = avatar || undefined; // undefined is OK, null might cause issues

  const groupIdsWithDraftsGroup = [...groupIds, getDraftsGroupName(id)];

  console.log("👤 [API] User info:", {
    name: safeName,
    id,
    color: safeColor,
    hasAvatar: !!safeAvatar,
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
        userInfo: {
          name: safeName,
          color: safeColor,
          avatar: safeAvatar,
        },
      }
    );
  } catch (err) {
    console.error("❌ [API] Liveblocks identifyUser failed:", err);
    return new Response(
      JSON.stringify({
        error: "Liveblocks authentication failed",
        details: err instanceof Error ? err.message : "Unknown error",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  const { status, body } = liveblocksResponse;

  console.log("📡 [API] Liveblocks response status:", status);

  if (status !== 200) {
    console.error("❌ [API] Liveblocks returned non-200 status:", status);
    return new Response(body, {
      status,
      headers: { "Content-Type": "application/json" },
    });
  }

  if (!body) {
    console.error("❌ [API] Liveblocks returned empty body");
    return new Response(
      JSON.stringify({
        error: "No token received",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Validate the body is valid JSON and has expected structure
  try {
    const parsed = JSON.parse(body);
    if (!parsed.token) {
      console.error("❌ [API] Response missing token field");
      console.error("📦 [API] Body keys:", Object.keys(parsed));
      return new Response(
        JSON.stringify({
          error: "Invalid token response",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
    console.log("✅ [API] Token validated successfully");
  } catch (parseErr) {
    console.error("❌ [API] Failed to parse Liveblocks response:", parseErr);
    return new Response(
      JSON.stringify({
        error: "Invalid response format",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  console.log("✅ [API] Liveblocks authentication successful");
  console.log("📦 [API] Body length:", body.length);

  // Return the Liveblocks response with proper Content-Type header
  return new Response(body, {
    status: 200,
    headers: { "Content-Type": "application/json" },
  });
}
