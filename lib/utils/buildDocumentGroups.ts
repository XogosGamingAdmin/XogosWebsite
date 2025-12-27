import { RoomData } from "@liveblocks/node";
import { DocumentGroup } from "@/types";
import { getGroup } from "../database/getGroup";
import { roomAccessesToDocumentAccess } from "./convertAccessType";

/**
 * Convert a Liveblocks room result into a list of DocumentGroups
 *
 * @param result - Liveblocks getRoomById() result
 */
export async function buildDocumentGroups(result: RoomData) {
  const groups: DocumentGroup[] = [];

  for (const [id, accessValue] of Object.entries(result.groupsAccesses)) {
    const group = await getGroup(id);

    if (group) {
      groups.push({
        ...group,
        access: roomAccessesToDocumentAccess(accessValue as any, false),
      });
    }
  }

  return groups;
}
