"use client";

import { Editor } from "@tiptap/react";
import { useState } from "react";
import { DocumentPublishDialog } from "@/components/Documents/DocumentPublishDialog";
import { publishDocumentToPublic } from "@/lib/actions";
import { useInitialDocument } from "@/lib/hooks";
import { Button } from "@/primitives/Button";
import { Tooltip } from "@/primitives/Tooltip";
import { PublishedDocumentCategory } from "@/types/published-document";
import styles from "./Toolbar.module.css";

type Props = {
  editor: Editor;
};

export function ToolbarPublish({ editor }: Props) {
  const document = useInitialDocument();
  const [isOpen, setIsOpen] = useState(false);

  const handlePublish = async (data: {
    category: PublishedDocumentCategory;
    description: string;
  }) => {
    // Get HTML content from the editor
    const content = editor.getHTML();

    const result = await publishDocumentToPublic({
      roomId: document.id,
      title: document.name,
      category: data.category,
      description: data.description,
      content,
    });

    if (result.error) {
      throw new Error(result.error.message);
    }
  };

  return (
    <DocumentPublishDialog
      documentId={document.id}
      documentName={document.name}
      onPublishDocument={handlePublish}
      open={isOpen}
      onOpenChange={setIsOpen}
    >
      <Tooltip content="Publish to public documentation">
        <Button variant="primary" className={styles.publishButton}>
          Publish
        </Button>
      </Tooltip>
    </DocumentPublishDialog>
  );
}
