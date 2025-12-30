import { redirect } from "next/navigation";
import { ReactNode } from "react";
import { auth } from "@/auth";

export default async function TextDocumentLayout({
  children,
}: {
  children: ReactNode;
}) {
  let session = null;

  try {
    session = await auth();
  } catch (error) {
    console.error("Error getting session in text document:", error);
    redirect("/signin?callbackUrl=/dashboard/documents");
  }

  // If not logged in, redirect to sign-in page
  if (!session) {
    redirect("/signin?callbackUrl=/dashboard/documents");
  }

  // If session.user.info is not set, redirect to sign-in to refresh session
  if (!session.user?.info) {
    console.error("Session user info missing, redirecting to sign-in");
    redirect("/signin?callbackUrl=/dashboard/documents");
  }

  return <>{children}</>;
}
