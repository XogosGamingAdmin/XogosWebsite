"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { MarketingLayout } from "@/layouts/Marketing";

export default function BoardroomLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin?callbackUrl=/boardroom");
    }
  }, [status, router]);

  if (status === "loading" || !session) {
    return (
      <MarketingLayout>
        <div
          style={{
            minHeight: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 100%)",
            color: "#e5e5e5",
          }}
        >
          <p>{status === "loading" ? "Loading..." : "Redirecting to sign in..."}</p>
        </div>
      </MarketingLayout>
    );
  }

  return <MarketingLayout>{children}</MarketingLayout>;
}
