import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { DashboardLayout } from "@/layouts/Dashboard";
import { getGroups } from "@/lib/database";

export default async function Dashboard({ children }: { children: ReactNode }) {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Error getting session in dashboard:", error);
    // Redirect to sign-in if auth fails
    redirect("/signin?callbackUrl=/dashboard");
  }

  // If not logged in, redirect to sign-in page
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  const groups = await getGroups(session?.user.info.groupIds ?? []);

  return <DashboardLayout groups={groups}>{children}</DashboardLayout>;
}
