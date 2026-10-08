"use server";

import { NextRequest, NextResponse } from "next/server";
import { query } from "@/lib/database";

/**
 * POST /api/contact - Submit a contact form message
 * Stores the message in the database for review
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, topic, message, website } = body;

    // Honeypot check - if website field is filled, it's likely a bot
    if (website && website.trim() !== "") {
      // Silently accept but don't store - looks like spam
      return NextResponse.json({ success: true });
    }

    // Validate required fields
    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    if (!message || typeof message !== "string" || message.trim().length < 10) {
      return NextResponse.json(
        { error: "Message must be at least 10 characters" },
        { status: 400 }
      );
    }

    // Sanitize inputs
    const sanitizedName = name.trim().slice(0, 100);
    const sanitizedEmail = email.trim().toLowerCase().slice(0, 254);
    const sanitizedTopic = (topic || "General question").slice(0, 100);
    const sanitizedMessage = message.trim().slice(0, 5000);

    // Store in database
    const result = await query(
      `INSERT INTO contact_messages (name, email, topic, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, created_at`,
      [sanitizedName, sanitizedEmail, sanitizedTopic, sanitizedMessage]
    );

    console.log(
      `Contact form submission from ${sanitizedEmail} - Topic: ${sanitizedTopic}`
    );

    return NextResponse.json({
      success: true,
      message: "Your message has been received. We'll reply soon!",
      id: result.rows[0].id,
    });
  } catch (error) {
    console.error("Contact form error:", error);

    return NextResponse.json(
      {
        error: "Failed to send message. Please try again or email us directly.",
        message:
          "Failed to send message. Please try again or email zack@xogosgaming.com directly.",
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/contact - List contact messages (admin only)
 */
export async function GET(request: NextRequest) {
  try {
    // Simple auth check - in production, use proper auth
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "new";

    const result = await query(
      `SELECT id, name, email, topic, message, status, created_at, replied_at
       FROM contact_messages
       WHERE status = $1
       ORDER BY created_at DESC
       LIMIT 100`,
      [status]
    );

    return NextResponse.json({
      success: true,
      messages: result.rows,
    });
  } catch (error) {
    console.error("Error fetching contact messages:", error);
    return NextResponse.json(
      { error: "Failed to fetch messages" },
      { status: 500 }
    );
  }
}
