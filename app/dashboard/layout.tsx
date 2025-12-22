import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { DashboardLayout } from "@/layouts/Dashboard";
import { getGroups } from "@/lib/database";

export default async function Dashboard({ children }: { children: ReactNode }) {
  const session = await auth();

  // If not logged in, redirect to sign-in page
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard");
  }

  const groups = await getGroups(session?.user.info.groupIds ?? []);

  return <DashboardLayout groups={groups}>{children}</DashboardLayout>;
}
