"use client";

import { ClientSideSuspense } from "@liveblocks/react";
import { getYjsProviderForRoom } from "@liveblocks/yjs";
import { CharacterCount } from "@tiptap/extension-character-count";
import Collaboration from "@tiptap/extension-collaboration";
import CollaborationCursor from "@tiptap/extension-collaboration-cursor";
import Highlight from "@tiptap/extension-highlight";
import { Image } from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import TaskList from "@tiptap/extension-task-list";
import { TextAlign } from "@tiptap/extension-text-align";
import { Typography } from "@tiptap/extension-typography";
import Youtube from "@tiptap/extension-youtube";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { EditorView } from "prosemirror-view";
import { useEffect, useState } from "react";
import * as Y from "yjs";
import { useRoom, useSelf } from "@/liveblocks.config";
import { DocumentSpinner } from "@/primitives/Spinner";
import { LiveblocksCommentsHighlight } from "./comment-highlight";
import { CustomTaskItem } from "./CustomTaskItem";
import { SelectionMenu } from "./SelectionMenu";
import { ThreadList } from "./ThreadList";
import { Toolbar } from "./Toolbar";
import { WordCount } from "./WordCount";
import styles from "./TextEditor.module.css";

export function TextEditor() {
  return (
    <ClientSideSuspense fallback={<DocumentSpinner />}>
      {() => <Editor />}
    </ClientSideSuspense>
  );
}

// Collaborative text editor with simple rich text and live cursors
export function Editor() {
  const room = useRoom();
  const [doc, setDoc] = useState<Y.Doc>();
  const [provider, setProvider] = useState<any>();
  const [error, setError] = useState<string | null>(null);

  // Set up Liveblocks Yjs provider with modern pattern
  useEffect(() => {
    let yProvider: any;
    let mounted = true;

    try {
      console.log("🔵 [EDITOR] Getting Yjs provider for room...");
      yProvider = getYjsProviderForRoom(room);

      if (!yProvider) {
        throw new Error("Failed to create Yjs provider");
      }

      console.log("🔵 [EDITOR] Getting Y.Doc...");
      const yDoc = yProvider.getYDoc();

      if (!yDoc) {
        throw new Error("Failed to get Y.Doc from provider");
      }

      if (mounted) {
        console.log("✅ [EDITOR] Yjs provider initialized successfully");
        setDoc(yDoc);
        setProvider(yProvider);
        setError(null);
      }
    } catch (err) {
      console.error("❌ [EDITOR] Error initializing Yjs provider:", err);
      if (mounted) {
        setError(
          err instanceof Error ? err.message : "Failed to initialize editor"
        );
      }
    }

    return () => {
      mounted = false;
      try {
        yProvider?.destroy();
      } catch (destroyErr) {
        console.warn("Warning destroying Yjs provider:", destroyErr);
      }
    };
  }, [room]);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red", textAlign: "center" }}>
        <p>Error loading editor: {error}</p>
        <p>Please try refreshing the page.</p>
      </div>
    );
  }

  if (!doc || !provider) {
    return <DocumentSpinner />;
  }

  return <TiptapEditor doc={doc} provider={provider} />;
}

type EditorProps = {
  doc: Y.Doc;
  provider: any;
};

function TiptapEditor({ doc, provider }: EditorProps) {
  // Get complete self object to ensure Liveblocks is fully initialized
  const self = useSelf();

  // Wait until Liveblocks connection is fully established with user info
  // Only render editor component when we have confirmed user data
  if (!self || !self.info || !self.info.name) {
    return <DocumentSpinner />;
  }

  // Once we have data, render the actual editor component
  return <TiptapEditorWithData doc={doc} provider={provider} self={self} />;
}

// Separate component that only renders when we have valid user data
// This ensures useEditor is never called with undefined data
function TiptapEditorWithData({
  doc,
  provider,
  self,
}: EditorProps & { self: any }) {
  // Extract user data with safe defaults
  const userName = self.info.name;
  const userColor = self.info.color || "#808080";
  const userAvatar = self.info.avatar;
  const canWrite = self.canWrite ?? false;

  // Set up editor with plugins, and place user info into Yjs awareness and cursors
  const editor = useEditor({
    editable: canWrite,
    editorProps: {
      attributes: {
        // Add styles to editor element
        class: styles.editor,
      },
    },
    extensions: [
      // Custom Liveblocks comments extension
      LiveblocksCommentsHighlight.configure({
        HTMLAttributes: {
          class: "comment-highlight",
        },
      }),
      StarterKit.configure({
        blockquote: {
          HTMLAttributes: {
            class: "tiptap-blockquote",
          },
        },
        code: {
          HTMLAttributes: {
            class: "tiptap-code",
          },
        },
        codeBlock: {
          languageClassPrefix: "language-",
          HTMLAttributes: {
            class: "tiptap-code-block",
            spellcheck: false,
          },
        },
        heading: {
          levels: [1, 2, 3],
          HTMLAttributes: {
            class: "tiptap-heading",
          },
        },
        // The Collaboration extension comes with its own history handling
        history: false,
        horizontalRule: {
          HTMLAttributes: {
            class: "tiptap-hr",
          },
        },
        listItem: {
          HTMLAttributes: {
            class: "tiptap-list-item",
          },
        },
        orderedList: {
          HTMLAttributes: {
            class: "tiptap-ordered-list",
          },
        },
        paragraph: {
          HTMLAttributes: {
            class: "tiptap-paragraph",
          },
        },
      }) as any,
      CharacterCount,
      Highlight.configure({
        HTMLAttributes: {
          class: "tiptap-highlight",
        },
      }),
      Image.configure({
        HTMLAttributes: {
          class: "tiptap-image",
        },
      }),
      Link.configure({
        HTMLAttributes: {
          class: "tiptap-link",
        },
      }),
      Placeholder.configure({
        placeholder: "Start writing…",
        emptyEditorClass: "tiptap-empty",
      }),
      CustomTaskItem,
      TaskList.configure({
        HTMLAttributes: {
          class: "tiptap-task-list",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Typography,
      Youtube.configure({
        modestBranding: true,
        HTMLAttributes: {
          class: "tiptap-youtube",
        },
      }),
      // Register the document with Tiptap
      Collaboration.configure({
        document: doc,
      }),
      // Attach provider and user info with safe defaults from extracted variables
      CollaborationCursor.configure({
        provider: provider,
        user: {
          name: userName,
          color: userColor,
          picture: userAvatar,
        },
      }),
    ],
  });

  return (
    <div className={styles.container}>
      {canWrite ? (
        <div className={styles.editorHeader}>
          {editor ? <Toolbar editor={editor} /> : null}
        </div>
      ) : null}
      <div className={styles.editorPanel}>
        {editor ? <SelectionMenu editor={editor} /> : null}
        <div className={styles.editorContainerOffset}>
          <div className={styles.editorContainer}>
            <EditorContent editor={editor} />
            <div className={styles.threadListContainer} data-threads="desktop">
              {editor ? <ThreadList editor={editor} /> : null}
            </div>
          </div>
          <div
            className={styles.mobileThreadListContainer}
            data-threads="mobile"
          >
            {editor ? <ThreadList editor={editor} /> : null}
          </div>
        </div>
      </div>
      {editor ? <WordCount editor={editor} /> : null}
    </div>
  );
}

// Prevents a matchesNode error on hot reloading
EditorView.prototype.updateState = function updateState(state) {
  // @ts-ignore
  if (!this.docView) return;
  // @ts-ignore
  this.updateStateInner(state, this.state.plugins != state.plugins);
};
