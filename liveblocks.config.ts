import {
  LiveList,
  LiveMap,
  LiveObject,
  ThreadData,
  createClient,
} from "@liveblocks/client";
import { createLiveblocksContext, createRoomContext } from "@liveblocks/react";
import { DOCUMENT_URL } from "@/constants";
import { getSpecificDocuments } from "@/lib/actions";
import { getUsers } from "./lib/database/getUsers";
import { User } from "./types";

// Creating client with Liveblocks authentication API endpoint
// The endpoint handles authentication and returns the Liveblocks token
const client = createClient({
  authEndpoint: async () => {
    console.log("🔵 [CLIENT] Calling /api/liveblocks-auth");
    try {
      const response = await fetch("/api/liveblocks-auth", {
        method: "POST",
      });

      console.log("🔵 [CLIENT] Response status:", response.status);

      if (!response.ok) {
        const error = await response.text();
        console.error("❌ [CLIENT] Auth failed:", error);
        throw new Error(`Authentication failed: ${response.status}`);
      }

      const data = await response.json();
      console.log("✅ [CLIENT] Auth successful, data keys:", Object.keys(data));

      return data;
    } catch (err) {
      console.error("❌ [CLIENT] Exception in authEndpoint:", err);
      throw err;
    }
  },

  // Resolve user IDs into name/avatar/etc for Comments/Notifications
  async resolveUsers({ userIds }) {
    const users = await getUsers({ userIds });
    return users.map((user) =>
      user
        ? { name: user.name, avatar: user.avatar, color: user.color }
        : { name: "Unknown User", avatar: undefined, color: "#888888" }
    );
  },

  // Resolve a mention suggestion into a userId e.g. `@tat` → `tatum.paolo@example.com`
  async resolveMentionSuggestions({ text }) {
    const users = await getUsers({ search: text });
    return users.filter((user) => user !== null).map((user) => user!.id);
  },

  // Resolve a room ID into room information for Notifications
  async resolveRoomsInfo({ roomIds }) {
    const documents = await getSpecificDocuments({ documentIds: roomIds });
    return documents.map((document) => ({
      name: document ? document.name : undefined,
      url: document ? DOCUMENT_URL(document.type, document.id) : undefined,
    }));
  },
});

// Presence represents the properties that will exist on every User in the Room
// and that will automatically be kept in sync. Accessible through the
// `user.presence` property. Must be JSON-serializable.
export type Presence = {
  cursor: { x: number; y: number } | null;
};

export type Note = LiveObject<{
  x: number;
  y: number;
  text: string;
  selectedBy: UserMeta["info"] | null;
  id: string;
}>;

export type Notes = LiveMap<string, Note>;

// Spreadsheet types
export type CellFormat = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: "left" | "center" | "right";
  textColor?: string;
  bgColor?: string;
};

export type Cell = LiveObject<{
  value: string;
  format?: CellFormat;
}>;

export type Column = LiveObject<{
  id: string;
  width: number;
}>;

export type Row = LiveObject<{
  id: string;
  height: number;
}>;

export type SpreadsheetData = LiveObject<{
  cells: LiveMap<string, Cell>;
  columns: LiveList<Column>;
  rows: LiveList<Row>;
}>;

// Optionally, Storage represents the shared document that persists in the
// Room, even after all Users leave. Fields under Storage typically are
// LiveList, LiveMap, LiveObject instances, for which updates are
// automatically persisted and synced to all connected clients.
type Storage = {
  notes: Notes;
  spreadsheet?: SpreadsheetData;
};

export type UserInfo = Pick<User, "name" | "avatar" | "color">;

// Optionally, UserMeta represents static/readonly metadata on each User, as
// provided by your own custom auth backend (if used). Useful for data that
// will not change during a session, like a User's name or avatar.
export type UserMeta = {
  info: UserInfo;
};

// Optionally, the type of custom events broadcast and listened for in this
// room. Must be JSON-serializable.
type RoomEvent = {
  type: "SHARE_DIALOG_UPDATE";
};

type ThreadMetadata = {
  resolved: boolean;
  highlightId: string;
};

export type CustomThreadData = ThreadData<ThreadMetadata>;
export const {
  suspense: {
    RoomProvider,
    useBroadcastEvent,
    useEventListener,
    useHistory,
    useCanUndo,
    useCanRedo,
    useCreateThread,
    useMutation,
    useOthers,
    useRoom,
    useSelf,
    useStorage,
    useThreads,
    useUpdateMyPresence,
    useUser,
  },
} = createRoomContext<Presence, Storage, UserMeta, RoomEvent, ThreadMetadata>(
  client
);

export const {
  suspense: {
    LiveblocksProvider,
    useInboxNotifications,
    useUnreadInboxNotificationsCount,
    useMarkAllInboxNotificationsAsRead,
  },
} = createLiveblocksContext(client);
