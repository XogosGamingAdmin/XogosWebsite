"use server";

import { liveblocks } from "@/liveblocks.server.config";
import { buildDocument } from "@/lib/utils";
import { Document } from "@/types";

type Props = {
  limit?: number;
};

/**
 * Get Published Documents
 *
 * Retrieves published documents for the Board Insights feed
 * Returns documents sorted by most recent connection
 *
 * @param limit - Maximum number of documents to return (default: 6)
 */
export async function getPublishedDocuments({ limit = 6 }: Props = {}) {
  try {
    // Get all rooms
    const { data: rooms } = await liveblocks.getRooms();

    // Filter for published rooms
    const publishedRooms = rooms.filter(
      (room) => room.metadata.published === "yes"
    );

    // Sort by lastConnectionAt (most recent first)
    publishedRooms.sort((a, b) => {
      const aTime = new Date(a.lastConnectionAt || 0).getTime();
      const bTime = new Date(b.lastConnectionAt || 0).getTime();
      return bTime - aTime;
    });

    // Limit results
    const limitedRooms = publishedRooms.slice(0, limit);

    // Convert to Document format
    const documents: Document[] = limitedRooms.map((room) =>
      buildDocument(room)
    );

    return { data: documents };
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: 500,
        message: "Error fetching published documents",
        suggestion: "Refresh the page and try again",
      },
    };
  }
}
