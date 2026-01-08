import { NextResponse } from "next/server";
import { getPublicDocuments } from "@/lib/actions/publishDocumentToPublic";

export async function GET() {
  try {
    const documents = await getPublicDocuments();
    return NextResponse.json({ documents });
  } catch (error) {
    console.error("Error fetching public documents:", error);
    return NextResponse.json({ documents: [] });
  }
}

// Revalidate every 60 seconds
export const revalidate = 60;
