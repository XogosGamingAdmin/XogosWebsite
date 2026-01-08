"use server";

import { promises as fs } from "fs";
import path from "path";
import { auth } from "@/auth";
import { liveblocks } from "@/liveblocks.server.config";
import {
  PublishedDocument,
  PublishedDocumentCategory,
  PublishedDocumentChapter,
  PublishedDocumentsData,
} from "@/types/published-document";

const PUBLISHED_DOCS_PATH = path.join(
  process.cwd(),
  "data",
  "published-docs.json"
);

type Props = {
  roomId: string;
  title: string;
  category: PublishedDocumentCategory;
  description: string;
  content: string;
};

/**
 * Generate a URL-friendly slug from a title
 */
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

/**
 * Extract chapters from HTML content by finding H1 and H2 headings
 */
function extractChapters(content: string): PublishedDocumentChapter[] {
  const chapters: PublishedDocumentChapter[] = [];
  const headingRegex = /<h[12][^>]*>(.*?)<\/h[12]>/gi;

  let match;
  let index = 0;

  while ((match = headingRegex.exec(content)) !== null) {
    const title = match[1].replace(/<[^>]*>/g, "").trim();
    if (title) {
      chapters.push({
        id: `chapter-${index}`,
        title,
      });
      index++;
    }
  }

  return chapters;
}

/**
 * Read the current published documents from the JSON file
 */
async function readPublishedDocs(): Promise<PublishedDocumentsData> {
  try {
    const data = await fs.readFile(PUBLISHED_DOCS_PATH, "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      documents: [],
      lastUpdated: new Date().toISOString(),
    };
  }
}

/**
 * Write published documents to the JSON file
 */
async function writePublishedDocs(data: PublishedDocumentsData): Promise<void> {
  await fs.writeFile(PUBLISHED_DOCS_PATH, JSON.stringify(data, null, 2), "utf-8");
}

/**
 * Publish Document to Public
 *
 * Publishes a document to the public /docs page and /board Board Documents card.
 * Extracts content, generates chapters from headings, and saves to JSON file.
 *
 * @param roomId - The Liveblocks room ID
 * @param title - Document title
 * @param category - Category for the document
 * @param description - SEO description
 * @param content - HTML content from the editor
 */
export async function publishDocumentToPublic({
  roomId,
  title,
  category,
  description,
  content,
}: Props) {
  let session;
  let room;

  try {
    const result = await Promise.all([auth(), liveblocks.getRoom(roomId)]);
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

  try {
    // Generate slug and extract chapters
    const slug = generateSlug(title);
    const chapters = extractChapters(content);
    const now = new Date().toISOString();

    // Create the published document
    const publishedDoc: PublishedDocument = {
      id: slug,
      sourceRoomId: roomId,
      title,
      category,
      description,
      content,
      chapters,
      publishedAt: now,
      lastUpdated: now,
      authorId: session.user.info.id,
      authorName: session.user.info.name,
      showOnBoard: true,
      status: "published",
    };

    // Read existing documents
    const docsData = await readPublishedDocs();

    // Check if document already exists (update) or is new (add)
    const existingIndex = docsData.documents.findIndex(
      (doc) => doc.sourceRoomId === roomId
    );

    if (existingIndex >= 0) {
      // Update existing document, preserve original publishedAt
      const originalPublishedAt = docsData.documents[existingIndex].publishedAt;
      publishedDoc.publishedAt = originalPublishedAt;
      publishedDoc.id = docsData.documents[existingIndex].id; // Keep original slug
      docsData.documents[existingIndex] = publishedDoc;
    } else {
      // Add new document
      docsData.documents.unshift(publishedDoc);
    }

    // Update lastUpdated timestamp
    docsData.lastUpdated = now;

    // Write back to file
    await writePublishedDocs(docsData);

    // Also update Liveblocks room metadata to mark as publicly published
    await liveblocks.updateRoom(roomId, {
      metadata: {
        ...room.metadata,
        published: "yes",
        publicSlug: publishedDoc.id,
      },
    });

    return { data: publishedDoc };
  } catch (err) {
    console.error("Error publishing document:", err);
    return {
      error: {
        code: 500,
        message: "Failed to publish document",
        suggestion: "Please try again",
      },
    };
  }
}

/**
 * Unpublish a document from public pages
 */
export async function unpublishDocumentFromPublic(roomId: string) {
  let session;
  let room;

  try {
    const result = await Promise.all([auth(), liveblocks.getRoom(roomId)]);
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
        suggestion: "Sign in to unpublish documents",
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
        suggestion: "Only the document creator can unpublish it",
      },
    };
  }

  try {
    // Read existing documents
    const docsData = await readPublishedDocs();

    // Remove the document
    docsData.documents = docsData.documents.filter(
      (doc) => doc.sourceRoomId !== roomId
    );
    docsData.lastUpdated = new Date().toISOString();

    // Write back to file
    await writePublishedDocs(docsData);

    // Update Liveblocks room metadata
    await liveblocks.updateRoom(roomId, {
      metadata: {
        ...room.metadata,
        published: "no",
        publicSlug: "",
      },
    });

    return { success: true };
  } catch (err) {
    console.error("Error unpublishing document:", err);
    return {
      error: {
        code: 500,
        message: "Failed to unpublish document",
        suggestion: "Please try again",
      },
    };
  }
}

/**
 * Get all publicly published documents
 */
export async function getPublicDocuments(): Promise<PublishedDocument[]> {
  const docsData = await readPublishedDocs();
  return docsData.documents.filter((doc) => doc.status === "published");
}

/**
 * Get a single published document by slug
 */
export async function getPublicDocumentBySlug(
  slug: string
): Promise<PublishedDocument | null> {
  const docsData = await readPublishedDocs();
  return docsData.documents.find((doc) => doc.id === slug) || null;
}
