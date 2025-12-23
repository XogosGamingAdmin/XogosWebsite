import { NextResponse } from "next/server";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID || "";
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || "";

  // Show partial values for debugging (first 10 and last 10 characters)
  const clientIdPreview = clientId.length > 20
    ? `${clientId.substring(0, 10)}...${clientId.substring(clientId.length - 10)}`
    : clientId ? "✓ Set (too short to preview)" : "✗ Missing";

  const secretPreview = clientSecret.length > 20
    ? `${clientSecret.substring(0, 8)}...${clientSecret.substring(clientSecret.length - 8)}`
    : clientSecret ? "✓ Set (too short to preview)" : "✗ Missing";

  const config = {
    GOOGLE_CLIENT_ID_PREVIEW: clientIdPreview,
    GOOGLE_CLIENT_SECRET_PREVIEW: secretPreview,
    NEXTAUTH_URL: process.env.NEXTAUTH_URL || "✗ Missing",
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET ? "✓ Set" : "✗ Missing",
    NODE_ENV: process.env.NODE_ENV,
  };

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    config,
  });
}
