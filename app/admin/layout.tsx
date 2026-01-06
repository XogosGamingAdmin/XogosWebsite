import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";
import { isAdmin } from "@/lib/auth/admin";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Error getting session in admin:", error);
    redirect("/dashboard");
  }

  if (!session || !session.user?.email) {
    redirect("/signin?callbackUrl=/admin");
  }

  // Check if user is an admin
  if (!isAdmin(session.user.email)) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
