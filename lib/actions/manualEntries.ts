"use server";

import { auth } from "@/auth";
import { db } from "@/lib/database";

// Only Zack can add manual entries
const MANUAL_ENTRY_ADMIN = "zack@xogosgaming.com";

function canAddManualEntries(email: string | null | undefined): boolean {
  if (!email) return false;
  return email.toLowerCase().trim() === MANUAL_ENTRY_ADMIN.toLowerCase();
}

/**
 * Add a manual member entry
 */
export async function addManualMember(
  memberType: "monthly" | "yearly" | "lifetime",
  count: number,
  notes: string,
  entryDate: string
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canAddManualEntries(userEmail)) {
      return { success: false, error: "Not authorized to add manual entries" };
    }

    const result = await db.addManualMember(
      memberType,
      count,
      notes,
      new Date(entryDate),
      userEmail!
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding manual member:", error);
    return { success: false, error: "Failed to add manual member" };
  }
}

/**
 * Add a manual revenue entry
 */
export async function addManualRevenue(
  amount: number,
  description: string,
  revenueDate: string
) {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canAddManualEntries(userEmail)) {
      return { success: false, error: "Not authorized to add manual entries" };
    }

    const result = await db.addManualRevenue(
      amount,
      description,
      new Date(revenueDate),
      userEmail!
    );

    return { success: true, data: result };
  } catch (error) {
    console.error("Error adding manual revenue:", error);
    return { success: false, error: "Failed to add manual revenue" };
  }
}

/**
 * Get recent manual entries
 */
export async function getRecentManualEntries() {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canAddManualEntries(userEmail)) {
      return null;
    }

    return await db.getRecentManualEntries(20);
  } catch (error) {
    console.error("Error fetching manual entries:", error);
    return null;
  }
}

/**
 * Delete a manual entry
 */
export async function deleteManualEntry(id: string, entryType: "member" | "revenue") {
  try {
    const session = await auth();
    const userEmail = session?.user?.email;

    if (!canAddManualEntries(userEmail)) {
      return { success: false, error: "Not authorized" };
    }

    if (entryType === "member") {
      await db.deleteManualMember(id);
    } else {
      await db.deleteManualRevenue(id);
    }

    return { success: true };
  } catch (error) {
    console.error("Error deleting manual entry:", error);
    return { success: false, error: "Failed to delete entry" };
  }
}

/**
 * Check if user can add manual entries
 */
export async function checkManualEntryAccess() {
  const session = await auth();
  return canAddManualEntries(session?.user?.email);
}
