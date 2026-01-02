"use client";

import { LiveMap } from "@liveblocks/client";
import { ClientSideSuspense } from "@liveblocks/react";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { DocumentHeader, DocumentHeaderSkeleton } from "@/components/Document";
import { TextEditor } from "@/components/TextEditor";
import { DocumentLayout } from "@/layouts/Document";
import { ErrorLayout } from "@/layouts/Error";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { InitialDocumentProvider } from "@/lib/hooks";
import { RoomProvider, useSelf } from "@/liveblocks.config";
import { Document, ErrorData } from "@/types";
import { DocumentSpinner } from "@/primitives/Spinner";

type Props = {
  initialDocument: Document | null;
  initialError: ErrorData | null;
};

export function TextDocumentView({ initialDocument, initialError }: Props) {
  const { id, error: queryError } = useParams<{ id: string; error: string }>();
  const [error, setError] = useState<ErrorData | null>(initialError);

  // If error object in params, retrieve it
  useEffect(() => {
    if (queryError) {
      setError(JSON.parse(decodeURIComponent(queryError as string)));
    }
  }, [queryError]);

  if (error) {
    return <ErrorLayout error={error} />;
  }

  if (!initialDocument) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />} />;
  }

  return (
    <ErrorBoundary>
      <RoomProvider
        id={id as string}
        initialPresence={{ cursor: null }}
        initialStorage={{ notes: new LiveMap() }}
      >
        <ClientSideSuspense fallback={<DocumentLayout header={<DocumentHeaderSkeleton />}><DocumentSpinner /></DocumentLayout>}>
          {() => <RoomContent initialDocument={initialDocument} />}
        </ClientSideSuspense>
      </RoomProvider>
    </ErrorBoundary>
  );
}

// Component that only renders after Liveblocks authentication is complete
function RoomContent({ initialDocument }: { initialDocument: Document }) {
  // This will cause the component to suspend until authentication is complete
  const self = useSelf();

  // Wait until we have confirmed user data from Liveblocks
  if (!self || !self.info) {
    return <DocumentLayout header={<DocumentHeaderSkeleton />}><DocumentSpinner /></DocumentLayout>;
  }

  return (
    <InitialDocumentProvider initialDocument={initialDocument}>
      <DocumentLayout
        header={<DocumentHeader documentId={initialDocument.id} />}
      >
        <TextEditor />
      </DocumentLayout>
    </InitialDocumentProvider>
  );
}
