"use client";

import clsx from "clsx";
import { useSession } from "next-auth/react";
import { ComponentProps, useCallback, useMemo, useState } from "react";
import {
  DocumentCreatePopover,
  DocumentRowSkeleton,
} from "@/components/Documents";
import { DocumentRowGroup } from "@/components/Documents/DocumentRowGroup";
import { DeleteIcon, PlusIcon } from "@/icons";
import { deleteDocuments, GetDocumentsProps } from "@/lib/actions";
import { usePaginatedDocumentsSWR } from "@/lib/hooks";
import { LiveblocksProvider } from "@/liveblocks.config";
import { Button } from "@/primitives/Button";
import { Container } from "@/primitives/Container";
import { Select } from "@/primitives/Select";
import { Spinner } from "@/primitives/Spinner";
import { DocumentType, Group } from "@/types";
import { capitalize } from "@/utils";
import styles from "./DocumentsList.module.css";

// Load `x` documents at a time
const DOCUMENT_LOAD_LIMIT = 10;

interface Props extends ComponentProps<"div"> {
  filter?: "all" | "drafts" | "group";
  group?: Group;
}

export function DocumentsList({
  filter = "all",
  group,
  className,
  ...props
}: Props) {
  const { data: session } = useSession();
  const [documentType, setDocumentType] = useState<DocumentType | "all">("all");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [selectionMode, setSelectionMode] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectionChange = useCallback(
    (documentId: string, selected: boolean) => {
      setSelectedIds((prev) => {
        const next = new Set(prev);
        if (selected) {
          next.add(documentId);
        } else {
          next.delete(documentId);
        }
        return next;
      });
    },
    []
  );

  const toggleSelectionMode = useCallback(() => {
    setSelectionMode((prev) => {
      if (prev) {
        setSelectedIds(new Set());
      }
      return !prev;
    });
  }, []);

  const clearSelection = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // Return `getDocuments` params for the current filters/group
  const getDocumentsOptions: GetDocumentsProps | null = useMemo(() => {
    if (!session || !session.user?.info) {
      return null;
    }

    const currentDocumentType =
      documentType === "all" ? undefined : documentType;

    // Get the current user's drafts
    if (filter === "drafts") {
      return {
        documentType: currentDocumentType,
        userId: session.user.info.id,
        drafts: true,
        limit: DOCUMENT_LOAD_LIMIT,
      };
    }

    // Get the current group's documents
    if (filter === "group" && group?.id) {
      return {
        documentType: currentDocumentType,
        groupIds: [group.id],
        limit: DOCUMENT_LOAD_LIMIT,
      };
    }

    // Get all documents for the current user
    return {
      documentType: currentDocumentType,
      userId: session.user.info.id,
      groupIds: session.user.info.groupIds,
      limit: DOCUMENT_LOAD_LIMIT,
    };
  }, [filter, group, session, documentType]);

  // When session is found, find pages of documents with the above document options
  const {
    data,
    size,
    setSize,
    mutate: revalidateDocuments,
    isLoadingInitialData,
    isLoadingMore,
    isEmpty,
    isReachingEnd,
    // error,
    // isValidating,
    // isRefreshing,
  } = usePaginatedDocumentsSWR(getDocumentsOptions, {
    refreshInterval: 10000,
  });

  const documentsPages = data ?? [];

  const handleBulkDelete = useCallback(async () => {
    if (selectedIds.size === 0) return;

    const confirmed = window.confirm(
      `Are you sure you want to delete ${selectedIds.size} document${selectedIds.size > 1 ? "s" : ""}?`
    );

    if (!confirmed) return;

    setIsDeleting(true);
    try {
      const result = await deleteDocuments({
        documentIds: Array.from(selectedIds),
      });

      if (result.error) {
        alert(result.error.message);
      } else if (result.data) {
        if (result.data.failCount > 0) {
          alert(
            `Deleted ${result.data.successCount} document(s). ${result.data.failCount} failed.`
          );
        }
        revalidateDocuments();
        setSelectedIds(new Set());
        setSelectionMode(false);
      }
    } catch (err) {
      console.error("Bulk delete error:", err);
      alert("An error occurred while deleting documents");
    } finally {
      setIsDeleting(false);
    }
  }, [selectedIds, revalidateDocuments]);

  if (!session || !session.user?.info) {
    return (
      <Container
        size="small"
        className={clsx(className, styles.documents)}
        {...props}
      >
        <div className={styles.container}>
          <div className={styles.emptyState}>
            <p>You don't have access to these documents.</p>
          </div>
        </div>
      </Container>
    );
  }

  const createDocumentButton = (
    <DocumentCreatePopover
      align="end"
      userId={session.user.info.id}
      groupIds={group?.id ? [group.id] : undefined}
      draft={filter === "drafts" || filter === "all"}
      sideOffset={12}
    >
      <Button icon={<PlusIcon />}>
        {group?.id ? "New document" : "New draft"}
      </Button>
    </DocumentCreatePopover>
  );

  return (
    <LiveblocksProvider>
      <Container
        size="small"
        className={clsx(className, styles.documents)}
        {...props}
      >
        <div className={styles.header}>
          <h1 className={styles.headerTitle}>
            {group?.name ?? capitalize(filter)}
          </h1>
          <div className={styles.headerActions}>
            <Select
              initialValue="all"
              items={[
                { value: "all", title: "All" },
                { value: "text", title: "Text" },
                { value: "whiteboard", title: "Whiteboard" },
                { value: "spreadsheet", title: "Spreadsheet", disabled: true },
              ]}
              onChange={(value: "all" | DocumentType) => {
                setDocumentType(value);
                revalidateDocuments();
              }}
              className={styles.headerSelect}
            />
            <Button
              variant={selectionMode ? "primary" : "secondary"}
              onClick={toggleSelectionMode}
            >
              {selectionMode ? "Cancel" : "Select"}
            </Button>
            {createDocumentButton}
          </div>
        </div>

        {selectionMode && selectedIds.size > 0 && (
          <div className={styles.bulkActions}>
            <span className={styles.selectedCount}>
              {selectedIds.size} selected
            </span>
            <Button
              icon={isDeleting ? <Spinner /> : <DeleteIcon />}
              variant="secondary"
              onClick={handleBulkDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button variant="subtle" onClick={clearSelection}>
              Clear
            </Button>
          </div>
        )}

        <div className={styles.container}>
          {!isLoadingInitialData ? (
            !isEmpty ? (
              <>
                {documentsPages.map((documentPage) => (
                  <DocumentRowGroup
                    key={documentPage.nextCursor}
                    documents={documentPage.documents}
                    revalidateDocuments={revalidateDocuments}
                    selectedIds={selectedIds}
                    onSelectionChange={handleSelectionChange}
                    selectionMode={selectionMode}
                  />
                ))}
                {!isReachingEnd ? (
                  <div className={styles.actions}>
                    <Button
                      disabled={isLoadingMore}
                      onClick={() => setSize(size + 1)}
                      icon={isLoadingMore ? <Spinner /> : null}
                    >
                      {isLoadingMore ? "Loading…" : "Show more"}
                    </Button>
                  </div>
                ) : null}
              </>
            ) : (
              <div className={styles.emptyState}>
                <p>No documents yet.</p>
                {createDocumentButton}
              </div>
            )
          ) : (
            <>
              <DocumentRowSkeleton className={styles.row} />
              <DocumentRowSkeleton className={styles.row} />
              <DocumentRowSkeleton className={styles.row} />
            </>
          )}
        </div>
      </Container>
    </LiveblocksProvider>
  );
}
