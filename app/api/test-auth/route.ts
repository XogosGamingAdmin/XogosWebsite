import { NextResponse } from "next/server";

export async function GET() {
  const diagnostics = {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID
      ? `Set (${process.env.GOOGLE_CLIENT_ID.substring(0, 20)}...)`
      : "❌ NOT SET",
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET
      ? `Set (${process.env.GOOGLE_CLIENT_SECRET.substring(0, 10)}...)`
      : "❌ NOT SET",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "❌ NOT SET",
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "❌ NOT SET",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json(diagnostics, { status: 200 });
}
