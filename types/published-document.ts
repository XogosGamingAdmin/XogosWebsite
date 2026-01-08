/**
 * Published Document Types
 *
 * These types define the structure for documents that have been published
 * to the public /docs page and /board Board Documents card.
 */

// Document categories matching the /docs page structure
export type PublishedDocumentCategory =
  | "whitepaper"
  | "education"
  | "blockchain"
  | "legal"
  | "tokenomics"
  | "technical"
  | "governance"
  | "strategic";

// Category display names for the UI
export const DOCUMENT_CATEGORIES: { id: PublishedDocumentCategory; name: string }[] = [
  { id: "whitepaper", name: "Whitepaper" },
  { id: "education", name: "Educational Framework" },
  { id: "blockchain", name: "Blockchain Integration" },
  { id: "legal", name: "Legal & Compliance" },
  { id: "tokenomics", name: "Tokenomics" },
  { id: "technical", name: "Technical Documentation" },
  { id: "governance", name: "Governance" },
  { id: "strategic", name: "Strategic" },
];

// Chapter structure for document navigation
export interface PublishedDocumentChapter {
  id: string;
  title: string;
  description?: string;
}

// Main published document type
export interface PublishedDocument {
  // Unique identifier (slug for URL)
  id: string;

  // Original Liveblocks room ID
  sourceRoomId: string;

  // Document title
  title: string;

  // Category for filtering
  category: PublishedDocumentCategory;

  // SEO description (user-provided)
  description: string;

  // HTML content exported from Tiptap
  content: string;

  // Auto-generated chapters from H1/H2 headings
  chapters: PublishedDocumentChapter[];

  // Publishing metadata
  publishedAt: string; // ISO date string
  lastUpdated: string; // ISO date string

  // Author information
  authorId: string;
  authorName: string;

  // Display options
  showOnBoard: boolean; // Show in /board Board Documents card

  // Status (for potential future use)
  status: "published" | "archived";
}

// Input type for publishing a document
export interface PublishDocumentInput {
  roomId: string;
  title: string;
  category: PublishedDocumentCategory;
  description: string;
  content: string;
  showOnBoard: boolean;
}

// Published documents collection stored in JSON
export interface PublishedDocumentsData {
  documents: PublishedDocument[];
  lastUpdated: string;
}
