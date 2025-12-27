import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { DashboardLayout } from "@/layouts/Dashboard";
import { getGroups } from "@/lib/database/getGroups";

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

  const groups = await getGroups(session.user.info.groupIds ?? []);

  return <DashboardLayout groups={groups}>{children}</DashboardLayout>;
}
