"use server";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/database";

/**
 * POST /api/newsletter - Subscribe to newsletter
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, source } = body;

    // Validate email
    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Subscribe to newsletter
    const subscription = await db.subscribeToNewsletter(
      email,
      name || undefined,
      source || "website"
    );

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed to newsletter",
      data: {
        email: subscription.email,
        subscribedAt: subscription.subscribed_at,
      },
    });
  } catch (error) {
    console.error("Newsletter subscription error:", error);

    // Log the error
    try {
      await db.logError(
        "api_error",
        error instanceof Error ? error.message : "Unknown error",
        error instanceof Error ? error.stack : undefined,
        undefined,
        "/api/newsletter"
      );
    } catch {
      // Ignore logging errors
    }

    return NextResponse.json(
      { error: "Failed to subscribe. Please try again." },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/newsletter - Unsubscribe from newsletter
 */
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    const result = await db.unsubscribeFromNewsletter(email);

    if (!result) {
      return NextResponse.json(
        { error: "Email not found in subscriptions" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Successfully unsubscribed from newsletter",
    });
  } catch (error) {
    console.error("Newsletter unsubscribe error:", error);
    return NextResponse.json(
      { error: "Failed to unsubscribe. Please try again." },
      { status: 500 }
    );
  }
}
