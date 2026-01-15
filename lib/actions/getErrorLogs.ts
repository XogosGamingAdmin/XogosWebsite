"use server";

import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";
import { db } from "@/lib/database";

interface ErrorLog {
  id: string;
  errorType: string;
  errorMessage: string;
  errorStack: string | null;
  userId: string | null;
  url: string | null;
  userAgent: string | null;
  metadata: object | null;
  createdAt: string;
}

interface ErrorStats {
  errorType: string;
  count: number;
  lastOccurrence: string;
}

export async function getErrorLogs(limit: number = 50) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return { error: { message: "Unauthorized: Admin access required" } };
  }

  try {
    const logs = await db.getErrorLogs(limit);

    const data: ErrorLog[] = logs.map((log) => ({
      id: log.id,
      errorType: log.error_type,
      errorMessage: log.error_message,
      errorStack: log.error_stack,
      userId: log.user_id,
      url: log.url,
      userAgent: log.user_agent,
      metadata: log.metadata,
      createdAt: log.created_at?.toISOString() || new Date().toISOString(),
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching error logs:", error);
    return { error: { message: "Failed to fetch error logs" } };
  }
}

export async function getErrorStats(days: number = 7) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return { error: { message: "Unauthorized: Admin access required" } };
  }

  try {
    const stats = await db.getErrorStats(days);

    const data: ErrorStats[] = stats.map((stat) => ({
      errorType: stat.error_type,
      count: parseInt(stat.count),
      lastOccurrence:
        stat.last_occurrence?.toISOString() || new Date().toISOString(),
    }));

    return { data };
  } catch (error) {
    console.error("Error fetching error stats:", error);
    return { error: { message: "Failed to fetch error statistics" } };
  }
}

export async function clearOldErrorLogs(daysOld: number = 30) {
  const session = await auth();

  if (!session?.user?.email || !isAdmin(session.user.email)) {
    return { error: { message: "Unauthorized: Admin access required" } };
  }

  try {
    const deletedCount = await db.clearOldErrorLogs(daysOld);
    return { data: { deletedCount } };
  } catch (error) {
    console.error("Error clearing old logs:", error);
    return { error: { message: "Failed to clear old error logs" } };
  }
}
