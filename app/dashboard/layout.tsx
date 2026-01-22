import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { DashboardLayout } from "@/layouts/Dashboard";
import { Group } from "@/types";

/**
 * Fetch user's groups directly from database (not from cached session)
 * This ensures groups are always up-to-date when admin assigns them
 */
async function getUserGroupsFromDatabase(userId: string): Promise<Group[]> {
  try {
    const { db } = await import("@/lib/database");
    const dbGroups = await db.getGroupsForUser(userId);
    return dbGroups.map((g) => ({ id: g.id, name: g.name }));
  } catch (error) {
    console.error("Error fetching groups from database:", error);
    return [];
  }
}

export default async function Dashboard({ children }: { children: ReactNode }) {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Error getting session in dashboard:", error);
    redirect("/signin?callbackUrl=/dashboard");
  }

  // If not logged in, redirect to sign-in page
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  // If session.user.info is not set, redirect to sign-in to refresh session
  if (!session.user?.info) {
    console.error("Session user info missing, redirecting to sign-in");
    redirect("/signin?callbackUrl=/dashboard");
  }

  // Fetch groups directly from database to get latest assignments
  const groups = await getUserGroupsFromDatabase(session.user.email || session.user.info.id);

  return <DashboardLayout groups={groups}>{children}</DashboardLayout>;
}
