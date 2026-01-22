import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { pagePath, pageName, visitorId } = body;

    if (!pagePath) {
      return NextResponse.json(
        { error: "pagePath is required" },
        { status: 400 }
      );
    }

    const userAgent = request.headers.get("user-agent") || undefined;
    const referrer = request.headers.get("referer") || undefined;

    await db.logPageVisit(pagePath, pageName, visitorId, userAgent, referrer);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error tracking visit:", error);
    return NextResponse.json(
      { error: "Failed to track visit" },
      { status: 500 }
    );
  }
}
