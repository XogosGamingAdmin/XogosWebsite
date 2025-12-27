import { ChecklistItem } from "@/types/dashboard";

/**
 * This array simulates a database for board member checklists.
 * Admins (Zack Edwards and Michael Weaver) can create and manage
 * checklist items for each board member through the admin interface.
 * Board members can toggle completion status on their own items.
 */
export const checklists: ChecklistItem[] = [];
