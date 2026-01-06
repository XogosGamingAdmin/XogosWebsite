"use server";

import { auth } from "@/auth";
import { userAllowedInRoom } from "@/lib/utils";
import { liveblocks } from "@/liveblocks.server.config";
import { Document } from "@/types";

type Props = {
  documentIds: Document["id"][];
};

type DeleteResult = {
  documentId: string;
  success: boolean;
  error?: string;
};

/**
 * Delete Multiple Documents
 *
 * Deletes multiple documents by their IDs
 * Only deletes documents the user has write access to
 *
 * @param documentIds - Array of document IDs to delete
 */
export async function deleteDocuments({ documentIds }: Props) {
  const session = await auth();

  if (!session || !session.user?.info) {
    return {
      error: {
        code: 401,
        message: "Not authenticated",
        suggestion: "Please sign in to delete documents",
      },
    };
  }

  if (!documentIds || documentIds.length === 0) {
    return {
      error: {
        code: 400,
        message: "No documents specified",
        suggestion: "Select at least one document to delete",
      },
    };
  }

  const results: DeleteResult[] = [];
  const userId = session.user.info.id;
  const groupIds = session.user.info.groupIds ?? [];

  // Process each document
  for (const documentId of documentIds) {
    try {
      // Get room to check permissions
      const room = await liveblocks.getRoom(documentId);

      if (!room) {
        results.push({
          documentId,
          success: false,
          error: "Document not found",
        });
        continue;
      }

      // Check user has write access
      if (
        !userAllowedInRoom({
          accessAllowed: "write",
          userId,
          groupIds,
          room,
        })
      ) {
        results.push({
          documentId,
          success: false,
          error: "No permission to delete",
        });
        continue;
      }

      // Delete the room
      await liveblocks.deleteRoom(documentId);
      results.push({
        documentId,
        success: true,
      });
    } catch (err) {
      console.error(`Error deleting document ${documentId}:`, err);
      results.push({
        documentId,
        success: false,
        error: "Failed to delete",
      });
    }
  }

  const successCount = results.filter((r) => r.success).length;
  const failCount = results.filter((r) => !r.success).length;

  return {
    data: {
      results,
      successCount,
      failCount,
      totalRequested: documentIds.length,
    },
  };
}
