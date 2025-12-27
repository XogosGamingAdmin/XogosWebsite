"use server";

import { auth } from "@/auth";
import { liveblocks } from "@/liveblocks.server.config";
import { buildDocument } from "@/lib/utils";
import { Document } from "@/types";

type Props = {
  documentId: Document["id"];
  published: boolean;
};

/**
 * Publish Document
 *
 * Marks a document as published or unpublished for the Board Insights feed
 * Only the document creator can publish/unpublish
 *
 * @param documentId - The document ID
 * @param published - Whether to publish or unpublish the document
 */
export async function publishDocument({ documentId, published }: Props) {
  let session;
  let room;

  try {
    const result = await Promise.all([
      auth(),
      liveblocks.getRoom(documentId),
    ]);
    session = result[0];
    room = result[1];
  } catch (err) {
    console.error(err);
    return {
      error: {
        code: 500,
        message: "Error fetching document",
        suggestion: "Refresh the page and try again",
      },
    };
  }

  // Check user is logged in
  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not signed in",
        suggestion: "Sign in to publish documents",
      },
    };
  }

  // Check the room exists
  if (!room) {
    return {
      error: {
        code: 404,
        message: "Document not found",
        suggestion: "Check that you're on the correct page",
      },
    };
  }

  // Check user is the owner
  if (room.metadata.owner !== session.user.info.id) {
    return {
      error: {
        code: 403,
        message: "Not allowed",
        suggestion: "Only the document creator can publish it",
      },
    };
  }

  // Update the room metadata
  let updatedRoom;
  try {
    updatedRoom = await liveblocks.updateRoom(documentId, {
      metadata: {
        ...room.metadata,
        published: published ? "yes" : "no",
      },
    });
  } catch (err) {
    return {
      error: {
        code: 500,
        message: "Can't update document",
        suggestion: "Please refresh the page and try again",
      },
    };
  }

  if (!updatedRoom) {
    return {
      error: {
        code: 404,
        message: "Updated document not found",
        suggestion: "Contact an administrator",
      },
    };
  }

  const document: Document = buildDocument(updatedRoom);
  return { data: document };
}
